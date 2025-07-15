import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { freeMessagesEnvConfig, referralsEnvConfig } from 'src/shared/config';
import { FreeMessagesRequest } from 'src/entities/free-messages-request.entity';
import { Leaderboard } from 'src/entities/leaderboard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FreeMessagesRequest, Leaderboard]),
    ConfigModule.forFeature(freeMessagesEnvConfig),
    ConfigModule.forFeature(referralsEnvConfig),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
