import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { validateSignedMessage } from '../utils/validSignMessage';
import { generateMessage } from '../utils/generateMessage';
import { freeMessagesEnvConfig, heliusEnvConfig, referralsEnvConfig } from '../../shared/config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(referralsEnvConfig.KEY) private readonly referralsConfig: ConfigType<typeof referralsEnvConfig>,
    @Inject(freeMessagesEnvConfig.KEY) private readonly freeMessagesConfig: ConfigType<typeof freeMessagesEnvConfig>,
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
    inviteCode?: string | null | undefined,
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
      wallet, messagesLeft: 0
    });
    if (inviteCode) {
      const referrer = await this.userRepository.findOne({
        where: { inviteCode },
      });
      if (referrer) {
        newUser.referrerId = referrer.id;
        newUser.discountPercent = this.referralsConfig.NEW_REFERRALS_DISCOUNT_PERCENT;
      } else {
        throw new UnauthorizedException('Invalid invite code');
      }
    }
    const user = await this.userRepository.save(newUser);
    return user;
  }

  async requestFreeMessages(user: User) {
    if (user.claimedFreeMessages === true) {
      throw new BadRequestException('You already claimed free messages');
    }
    
    const usersWithFreeMessages = (await this.userRepository.find({ 
      where: { claimedFreeMessages: true },
    })).length;
    if (usersWithFreeMessages >= this.freeMessagesConfig.MAX_FREE_MESSAGES_REQUESTS) {
      throw new BadRequestException('Max amount of claimed free messages reached');
    }

    user.claimedFreeMessages = true;
    user.messagesLeft += 3;
    await this.userRepository.save(user);

    return;
  }

  async countReferrals(userId: string): Promise<number> {
    return await this.userRepository.count({
      where: { referrerId: userId },
    });
  }
}
