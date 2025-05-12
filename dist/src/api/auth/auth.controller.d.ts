import { AuthService } from './auth.service';
import { SigninWalletDto } from '../dtos/signinWallet.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginWithWallet(signin: SigninWalletDto): Promise<void>;
}
