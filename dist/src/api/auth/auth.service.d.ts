import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { NonceService } from '../nonce/nonce.service';
export declare class AuthService {
    private readonly jwtService;
    private readonly usersService;
    private readonly nonceService;
    private readonly logger;
    constructor(jwtService: JwtService, usersService: UserService, nonceService: NonceService);
    loginWithSolanaWallet(address: string, signature: string, nonce: string): Promise<{
        accessToken: string;
    }>;
    requestMessage(address: string): Promise<{
        message: string;
        nonce: string;
    }>;
}
