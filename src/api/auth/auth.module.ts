import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { NonceModule } from '../nonce/nonce.module';
import { jwtConfig } from './jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { jwtEnvConfig } from 'src/shared/config';

@Module({
  imports: [ConfigModule.forFeature(jwtEnvConfig), JwtModule.registerAsync(jwtConfig), UserModule, NonceModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
