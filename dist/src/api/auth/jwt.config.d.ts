import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
export declare const jwtConfig: {
    imports: (typeof ConfigModule)[];
    inject: (typeof ConfigService)[];
    useFactory: (configService: ConfigService) => Promise<JwtModuleOptions>;
};
