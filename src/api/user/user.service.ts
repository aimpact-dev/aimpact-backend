import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { validateSignedMessage } from '../utils/validSignMessage';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // findByWalletAddress
  async findByWalletAddress(wallet: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { wallet } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUserWithSolanaWallet(
    wallet: string,
    signedMessage: string,
  ): Promise<User> {
    const message = `I agree that I am registered in aimpact as user and allow to store my ${wallet} wallet address`;
    const isValid = validateSignedMessage(wallet, message, signedMessage);
    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }
    // 2. Prevent replay attacks by checking nonce
    const existingUser = await this.userRepository.findOne({
      where: { wallet },
    });
    if (existingUser) {
      throw new UnauthorizedException(
        'User with such wallet address already exist',
      );
    }
    const newUser = this.userRepository.create({
      wallet,
    });
    const user = await this.userRepository.save(newUser);
    return user;
  }
}
