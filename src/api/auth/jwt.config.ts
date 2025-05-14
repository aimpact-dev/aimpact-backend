import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<JwtModuleOptions> => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
  }),
};
