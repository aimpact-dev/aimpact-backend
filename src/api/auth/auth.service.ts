import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UserService } from '../user/user.service';
import { NonceService } from '../nonce/nonce.service';
import * as nacl from 'tweetnacl';
import * as bs58 from 'bs58';
import { validateSignedMessage } from '../utils/validSignMessage';
import { SignupWalletDto } from '../dtos/signupWallet.dto';
import { generateMessage } from '../utils/generateMessage';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly nonceService: NonceService,
  ) {}
1
  async loginWithSolanaWallet(
    address: string,
    signature: string,
    nonce: string,
  ) {
    let user = await this.usersService.findByWalletAddress(address);
    if (!user) {
      user = await this.usersService.createUserWithSolanaWallet(address, signature, nonce);
    }
    let isNonceUsed = await this.nonceService.isNonceUsed(user.id, nonce);
    if (isNonceUsed) {
      throw new HttpException(
        `User with wallet address ${address} have already used the nonce ${nonce}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const message = generateMessage(nonce);
    const isValid = validateSignedMessage(address, message, signature);
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

  async requestMessage(address: string) {
    const nonce = await this.nonceService.createNewNonce(address);
    const message = generateMessage(nonce.nonce);
    return { message, nonce: nonce.nonce };
  }
}
