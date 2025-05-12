import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { NonceModule } from '../nonce/nonce.module';
import { jwtConfig } from '../config/jwt.config';

@Module({
  imports: [
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtConfig),
    UserModule,
    NonceModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
