import { ConfigType } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { jwtEnvConfig } from 'src/shared/config';
export declare const jwtConfig: {
    imports: import("@nestjs/common").DynamicModule[];
    useFactory: (jwtConfig: ConfigType<typeof jwtEnvConfig>) => Promise<JwtModuleOptions>;
    inject: (string | symbol)[];
};
