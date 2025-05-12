import { AuthService } from './auth.service';
import { SigninWalletDto } from '../dtos/signinWallet.dto';
import { SignupWalletDto } from '../dtos/signupWallet.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginWithWallet(signin: SigninWalletDto): Promise<{
        access_token: string;
    }>;
    signupAndLoginWithSolanaWallet(signupDto: SignupWalletDto): Promise<{
        access_token: string;
    }>;
}
