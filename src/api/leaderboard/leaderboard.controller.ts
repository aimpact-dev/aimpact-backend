import { Body, Controller, Get, Post, UseGuards, Request, Param, BadRequestException } from '@nestjs/common';
import { TokenGuard } from '../auth/token-auth.guard';
import { LeaderboardService } from './leaderboard.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserMeResponse } from '../auth/response/user-me.response';
import { ApiContext } from '../auth/decorator/api-context.decorator';
import { User } from 'src/entities/user.entity';
import { Public } from '../auth/decorator/public.decorator';
import { AddPointsRequest } from './request/add-points.request';
import { isUUID } from 'class-validator';
import { AddPointsResponseDto } from './response/add-points.response';
import { LeaderboardPositionResponseDto } from './response/leaderboadr-position';
import { LeaderboardTopResponseDto } from './response/leaderboard-top.response';
import { ViewProjectResponseDto } from './response/view-project.response';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private readonly leaderboardService: LeaderboardService,
  ) {}

  @Public()
  @UseGuards(TokenGuard)
  @Post('add-points')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add points to a user leaderboard entry' })
  @ApiBody({ type: AddPointsRequest })
  @ApiResponse({
    status: 200,
    description: 'New total points',
    type: AddPointsResponseDto,
  })
  addPoinst(
    @Body() dto: AddPointsRequest,
  ) {
    return this.leaderboardService.addPoints(dto);
  }

  @ApiBearerAuth()
  @Get('get-leaderboard-top')
  @ApiOperation({ summary: 'Get top 100 leaderboard entries' })
  @ApiResponse({
    status: 200,
    description: 'Top 100 with metadata',
    type: LeaderboardTopResponseDto
  })
  getLeaderboardTop() {
    return this.leaderboardService.getTop100Leaderboard();
  }
  
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get current user position and points' })
  @ApiResponse({
    status: 200,
    description: 'User leaderboard position',
    type: LeaderboardPositionResponseDto
  })
  getLeaderboardPosition(@ApiContext() user: User) {
    return this.leaderboardService.getUserPosition(user.id);
  }

  @Public()
  @UseGuards(TokenGuard)
  @Post('projects/:projectId/view')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Increment project view count and award points'
  })
  @ApiParam({
    name: 'projectId',
    description: 'Project UUID',
    type: 'string',
    format: 'uuid'
  })
  @ApiResponse({
    status: 200,
    description: 'Updated view count and points',
    type: ViewProjectResponseDto
  })
  viewProject(@Param('projectId') projectId: string) {
    if (!projectId || !isUUID(projectId)) {
      throw new BadRequestException("ProjectId is not valid.")
    }
    return this.leaderboardService.addViewForProject(projectId);
  }
}
