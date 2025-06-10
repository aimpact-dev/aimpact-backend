import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { validateSignedMessage } from '../utils/validSignMessage';
import { generateMessage } from '../utils/generateMessage';
import { freeMessagesEnvConfig, heliusEnvConfig, referralsEnvConfig } from '../../shared/config';
import { ConfigType } from '@nestjs/config';
import { RequestFreeMessagesRequest } from './request/request-free-messages.request';
import { FreeMessagesRequest } from 'src/entities/free-messages-request.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FreeMessagesRequest)
    private readonly freeMessagesRequestRepository: Repository<FreeMessagesRequest>,
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
      throw new UnauthorizedException('User with such wallet address already exist');
    }
    const newUser = this.userRepository.create({
      wallet,
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

  async requestFreeMessages(user: User, dto: RequestFreeMessagesRequest) {
    if (user.claimedFreeMessages === true) {
      throw new BadRequestException('You already claimed free messages');
    }
    const alreadyExistsHandle = await this.freeMessagesRequestRepository.findOne({
      where: { twitterHandle: dto.twitterHandle },
    });
    const alreadyExistsUser = await this.freeMessagesRequestRepository.findOne({
      where: { user: { wallet: user.wallet } },
      relations: ['user'],
    });
    if (alreadyExistsHandle) {
      throw new BadRequestException('This twitter handle already used.');
    }
    if (alreadyExistsUser) {
      throw new BadRequestException('You alredy requestsed messages.');
    }

    const freeMessagesRequest = this.freeMessagesRequestRepository.create({
      twitterHandle: dto.twitterHandle,
      userId: user.id,
      messages: this.freeMessagesConfig.FREE_MESSAGES_PER_REQUEST,
    });
    await this.freeMessagesRequestRepository.save(freeMessagesRequest);

    return;
  }

  async isUserHaveRequest(user: User) {
    const alreadyExists = await this.freeMessagesRequestRepository.find({
      where: { userId: user.id },
    });
    return {
      userHaveRequest: alreadyExists.length > 0,
    };
  }

  async adminRequestFreeMessages(user: User) {
    const usersWithFreeMessages = (
      await this.userRepository.find({
        where: { claimedFreeMessages: true },
      })
    ).length;
    if (usersWithFreeMessages >= this.freeMessagesConfig.MAX_FREE_MESSAGES_REQUESTS) {
      throw new BadRequestException('Max amount of claimed free messages reached');
    }

    user.claimedFreeMessages = true;
    user.messagesLeft += this.freeMessagesConfig.FREE_MESSAGES_PER_REQUEST;
    await this.userRepository.save(user);
  }

  async countReferrals(userId: string): Promise<number> {
    return await this.userRepository.count({
      where: { referrerId: userId },
    });
  }
}
