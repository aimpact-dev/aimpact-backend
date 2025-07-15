import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AddPointsRequest } from './request/add-points.request';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { Leaderboard } from 'src/entities/leaderboard.entity';
import { Project } from 'src/entities/project.entity';
import { rankingPoints, RankTypes } from './utils/rank-system';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Leaderboard) private readonly leaderboardRepository: Repository<Leaderboard>,
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
  ) {}

  async addPoints(dto: AddPointsRequest) {
    const user = await this.userRepository.findOne({
      where: {
        id: dto.userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    let pointsToAdd: number | null;
    const pointsRange = rankingPoints[dto.eventType];
    if (typeof pointsRange === 'number') {
      pointsToAdd = pointsRange;
    } else {
      pointsToAdd = dto.points || pointsRange[0];
    }

    let leaderboard: Leaderboard | null;
    leaderboard = await this.leaderboardRepository.findOne({
      where: {
        user,
      },
    });
    if (!leaderboard) {
      // Create if not exists
      leaderboard = this.leaderboardRepository.create({
        points: pointsToAdd,
        user,
      });
      await this.leaderboardRepository.save(leaderboard);
    }

    await this.leaderboardRepository.update(
      {
        userId: leaderboard.userId,
      },
      {
        points: leaderboard.points + dto.points,
      },
    );

    return {
      points: leaderboard.points + dto.points,
    };
  }

  async getTop100Leaderboard() {
    const top100positions = await this.leaderboardRepository.findAndCount({
      order: { points: 'DESC' },
      take: 100,
      relations: ['user'],
    });

    const filteredTop100Positions = top100positions[0].map((obj) => ({
      points: obj.points,
      user: {
        id: obj.user.id,
        wallet: obj.user.wallet,
      },
    }));
    const top100PointsOnly = top100positions[0].map((val) => val.points);
    const pointsInTop = top100PointsOnly.reduce((prev, curr) => prev + curr);
    return {
      positions: filteredTop100Positions,
      meta: {
        pointsInTop,
        totalCount: top100positions[1],
      },
    };
  }

  async getUserPosition(userId: string) {
    const leadeboardPosition = await this.leaderboardRepository.findOne({
      where: { userId },
      select: ['points'],
    });
    console.log(userId, leadeboardPosition);
    if (!leadeboardPosition) {
      throw new NotFoundException('User not found');
    }
    const higherCount = await this.leaderboardRepository.count({
      where: { points: MoreThan(leadeboardPosition.points) },
    });
    return {
      points: leadeboardPosition.points,
      position: higherCount + 1,
    };
  }

  async addViewForProject(projectId: string) {
    const updatedProject = await this.projectRepository
      .createQueryBuilder()
      .update(Project)
      .set({ views: () => '"views" + 1' })
      .where('id = :id', { id: projectId })
      .returning(['views', 'userId'])
      .execute();
    if (updatedProject.affected === 0) {
      throw new NotFoundException('Project not found');
    }
    console.log(projectId, updatedProject.raw[0]);
    const pointsToAdd = rankingPoints[RankTypes.PROJECT_VIEW];
    const userId = updatedProject.raw[0].userId;
    const updatedLeaderboardPosition = await this.leaderboardRepository
      .createQueryBuilder()
      .update(Leaderboard)
      .set({ points: () => `"points" + :inc` })
      .setParameter('inc', pointsToAdd)
      .where('userId = :userId', { userId })
      .returning(['points', 'user_id'])
      .execute();

    console.log(updatedLeaderboardPosition);
    if (typeof updatedLeaderboardPosition.raw !== 'object' && (updatedLeaderboardPosition.raw as any[]).length === 0) {
      throw new NotFoundException('Leaderboard position not found');
    }
    return {
      views: updatedProject.raw[0].views,
      points: updatedLeaderboardPosition.raw[0].points,
      projectId,
      userId,
    };
  }

  createForUser(userId: string, data: string | null = null) {
    return this.leaderboardRepository.save({ user: { id: userId }, data });
  }
}
