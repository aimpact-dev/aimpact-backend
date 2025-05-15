import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { jwtEnvConfig } from 'src/shared/config';

export const jwtConfig = {
  imports: [ConfigModule.forFeature(jwtEnvConfig)],
  useFactory: async (jwtConfig: ConfigType<typeof jwtEnvConfig>): Promise<JwtModuleOptions> => ({
    secret: jwtConfig.JWT_SECRET,
    signOptions: { expiresIn: jwtConfig.JWT_EXPIRATION },
  }),
  inject: [jwtEnvConfig.KEY],
};
