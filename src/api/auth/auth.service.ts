import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  // async loginWithSolanaWallet(
  //   address: string,
  //   signedMessage: string,
  //   nonce: number,
  // ) {
  //   const user: User = await this.usersService.findByWalletAddress(address);
  //   if (!user) {
  //     throw new HttpException(
  //       `User with wallet address ${address} haven't been registered yet.`,
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }
  //   let isNonceUsed = await this.nonceService.isNonceUsed(user.id, nonce);
  //   if (isNonceUsed) {
  //     throw new HttpException(
  //       `User with wallet address ${address} have already used the nonce ${nonce}`,
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }
  //   const message = `Sign this message to prove you have access to this wallet with nonce ${nonce}.`;
  //   const isValid = validateSignedMessage(address, message, signedMessage);
  //   await this.nonceService.addUsedNonce(user.id, nonce);
  //   if (isValid) {
  //     return this.login(user);
  //   } else {
  //     throw new HttpException(
  //       `The signed message isn't valid`,
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }
  // }
}
