import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { NonceService } from '../nonce/nonce.service';
import { SignupWalletDto } from '../dtos/signupWallet.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly usersService;
    private readonly nonceService;
    private readonly logger;
    constructor(jwtService: JwtService, usersService: UserService, nonceService: NonceService);
    loginWithSolanaWallet(address: string, signedMessage: string, nonce: number): Promise<{
        access_token: string;
    }>;
    signupAndLoginWithSolanaWallet(signupDto: SignupWalletDto): Promise<{
        access_token: string;
    }>;
}
