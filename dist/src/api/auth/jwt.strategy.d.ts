import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly usersService;
    constructor(configService: ConfigService, usersService: UserService);
    validate(payload: any): Promise<{
        roles: any;
        id: number;
        wallet: string;
        nonces: import("../../entities/nonce.entity").Nonce[];
    }>;
}
export {};
