import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { NonceService } from '../nonce/nonce.service';
import { jwtEnvConfig } from 'src/shared/config';
import { ConfigType } from '@nestjs/config';
export declare class AuthService {
    private readonly jwtService;
    private readonly usersService;
    private readonly nonceService;
    private readonly jwtConfig;
    private readonly logger;
    constructor(jwtService: JwtService, usersService: UserService, nonceService: NonceService, jwtConfig: ConfigType<typeof jwtEnvConfig>);
    loginWithSolanaWallet(address: string, signature: string, nonce: string): Promise<{
        accessToken: string;
    }>;
    requestMessage(address: string): Promise<{
        message: string;
        nonce: string;
    }>;
}
