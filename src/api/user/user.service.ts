import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { validateSignedMessage } from '../utils/validSignMessage';
import { generateMessage } from '../utils/generateMessage';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByWalletAddress(wallet: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { wallet } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUserWithSolanaWallet(
    wallet: string,
    signature: string,
    nonce: string,
  ): Promise<User> {
    const message = generateMessage(nonce);
    const isValid = validateSignedMessage(wallet, message, signature);
    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }

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

  async requestFreeMessages(user: User) {
    if (user.claimedFreeMessages) {
      throw new BadRequestException('You already claimed free messages');
    }

    user.claimedFreeMessages = true;
    

    return;
  }
}
