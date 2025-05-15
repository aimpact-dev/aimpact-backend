import { ConfigType } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { jwtEnvConfig } from 'src/shared/config';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly jwtConfig;
    private readonly usersService;
    constructor(jwtConfig: ConfigType<typeof jwtEnvConfig>, usersService: UserService);
    validate(payload: any): Promise<{
        id: string;
        wallet: string;
        createdAt: Date;
        updatedAt: Date;
        projects: import("../../entities/project.entity").Project[];
    }>;
}
export {};
