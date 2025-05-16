import { AuthService } from './auth.service';
import { SigninWalletDto } from '../dtos/signinWallet.dto';
import { RequestMessageDto } from '../dtos/requestMessage.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginWithWallet(signin: SigninWalletDto): Promise<{
        accessToken: string;
    }>;
    requestMessage(signin: RequestMessageDto): Promise<{
        message: string;
        nonce: string;
    }>;
    userMe(request: any): Promise<{
        id: string;
        wallet: string;
        projectsCount: number;
    }>;
}
