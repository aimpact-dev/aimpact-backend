import { Controller, Post, Body, UnauthorizedException, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninWalletDto } from '../dtos/signinWallet.dto';
import { Public } from './decorator/public.decorator';
import { RequestMessageDto } from '../dtos/requestMessage.dto';
import { User } from 'src/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('loginWithWallet')
  @ApiOperation({
    summary: 'User login by sign message with his Solana wallet',
    description:
      'User need to sign message "Sign this message to prove you have access to this wallet with nonce <uniq nonce, for example you can use current timestamp>."',
  })
  @ApiBody({
    type: SigninWalletDto,
    description: 'User login credentials by using wallet.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful authentication.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
  })
  async loginWithWallet(@Body() signin: SigninWalletDto) {
    return this.authService.loginWithSolanaWallet(signin.walletAddress, signin.signedMessage, signin.nonce);
  }

  @Public()
  @Post('requestMessage')
  @ApiOperation({
    summary: 'Request message and nonce from backend',
    description:
      'User get this message and must sign it to be authorized',
  })
  @ApiBody({
    type: RequestMessageDto,
    description: 'User login credentials by using wallet.',
  })
  @ApiResponse({
    status: 200,
    description: 'Message created',
    schema: {
      example: {
        message: 'SignIn\n8a526a75-cb8c-4e54-a9a6-5e97b69910ab',
        nonce: '8a526a75-cb8c-4e54-a9a6-5e97b69910ab',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
  })
  async requestMessage(@Body() signin: RequestMessageDto) {
    return this.authService.requestMessage(signin.walletAddress);
  }

  @Get('me')
  @ApiOperation({
    summary: "Get current user info",
  })
  @ApiResponse({
    status: 200,
    description: "User info",
    type: User,
  })
  async userMe(@Request() request) {
    console.log(request.user)
    return this.authService.getMe(request.user.id);
  }
}
