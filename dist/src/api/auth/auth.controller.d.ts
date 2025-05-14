import { AuthService } from './auth.service';
import { SigninWalletDto } from '../dtos/signinWallet.dto';
import { RequestMessageDto } from '../dtos/requestMessage.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginWithWallet(signin: SigninWalletDto): Promise<{
        access_token: string;
    }>;
    requestMessage(signin: RequestMessageDto): Promise<{
        message: string;
        nonce: string;
    }>;
}
