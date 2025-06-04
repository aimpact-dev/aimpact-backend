import { Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { ApiContext } from '../auth/decorator/api-context.decorator';
import { UserGradeDto } from './dto/userGrade.dto';

@ApiTags('Wallet Grades')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('nps')
  @ApiOperation({
    summary: 'Write wallet address and grade to Google Sheets',
    description: 'Stores a wallet address with its corresponding grade (0-10) in Google Sheets',
  })
  @ApiBody({ type: UserGradeDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully written wallet grade data',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async writeWalletGrade(@ApiContext() user: User, @Body() dto: UserGradeDto) {
    await this.analyticsService.writeUsersGrade(user.id, dto);
  }
}
