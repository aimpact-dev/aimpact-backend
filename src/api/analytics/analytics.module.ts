import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { analyticsEnvConfig } from 'src/shared/config';
import { ConfigModule } from '@nestjs/config';
import { UserGrade } from 'src/entities/user-grade.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  imports: [
    ConfigModule.forFeature(analyticsEnvConfig),
    TypeOrmModule.forFeature([UserGrade]),
  ]
})
export class AnalyticsModule {}
