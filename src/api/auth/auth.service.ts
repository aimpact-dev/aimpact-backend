import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UserService } from '../user/user.service';
import { NonceService } from '../nonce/nonce.service';
import * as nacl from 'tweetnacl';
import * as bs58 from 'bs58';
import { validateSignedMessage } from '../utils/validSignMessage';
import { SignupWalletDto } from '../dtos/signupWallet.dto';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly nonceService: NonceService,
  ) {}
  async loginWithSolanaWallet(
    address: string,
    signedMessage: string,
    nonce: number,
  ) {
    const user = await this.usersService.findByWalletAddress(address);
    if (!user) {
      throw new HttpException(
        `User with wallet address ${address} haven't been registered yet.`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    let isNonceUsed = await this.nonceService.isNonceUsed(user.id, nonce);
    if (isNonceUsed) {
      throw new HttpException(
        `User with wallet address ${address} have already used the nonce ${nonce}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const message = `Sign this message to prove you have access to this wallet with nonce ${nonce}.`;
    const isValid = validateSignedMessage(address, message, signedMessage);
    await this.nonceService.addUsedNonce(user.id, nonce);
    if (isValid) {
      const payload = { sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new HttpException(
        `The signed message isn't valid`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async signupAndLoginWithSolanaWallet(signupDto: SignupWalletDto) {
    const newUser = await this.usersService.createUserWithSolanaWallet(
      signupDto.walletAddress,
      signupDto.signedMessage,
    );
    const payload = { sub: newUser.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
