import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Leaderboard } from 'src/entities/leaderboard.entity';
import { Project } from 'src/entities/project.entity';

@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  imports: [TypeOrmModule.forFeature([User, Leaderboard, Project])],
})
export class LeaderboardModule {}
