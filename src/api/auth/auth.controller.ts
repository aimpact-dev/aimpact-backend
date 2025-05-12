import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninWalletDto } from '../dtos/signinWallet.dto';
import { SignupWalletDto } from '../dtos/signupWallet.dto';
import { Public } from './public.decorator';

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
    return this.authService.loginWithSolanaWallet(
      signin.walletAddress,
      signin.signedMessage,
      signin.nonce,
    );
  }

  @Public()
  @Post('signupWalletAndAuth')
  @ApiOperation({
    summary: 'Register a new user by using Solana wallet and log-in',
  })
  @ApiBody({
    type: SignupWalletDto,
    description: 'Details for creating a new user by using wallet.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or user creation failed.',
  })
  async signupAndLoginWithSolanaWallet(@Body() signupDto: SignupWalletDto) {
    return this.authService.signupAndLoginWithSolanaWallet(signupDto);
  }
}
