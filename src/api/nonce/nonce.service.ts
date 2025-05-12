import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nonce } from 'src/entities/nonce.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NonceService {
  constructor(
    @InjectRepository(Nonce)
    private readonly nonceRepository: Repository<Nonce>,
  ) {}

  async addUsedNonce(userId: number, nonce: number): Promise<Nonce> {
    const userNonce = await this.nonceRepository.findOne({
      where: { nonce, userId },
    });
    if (userNonce) {
      throw new Error(`The user with ${userId} id already used nonce ${nonce}`);
    }
    let dateOfUsage = new Date();
    dateOfUsage = new Date(
      dateOfUsage.getTime() + dateOfUsage.getTimezoneOffset() * 60000,
    );
    const newNonce = await this.nonceRepository.create({
      userId,
      nonce,
      dateOfUsage,
    });
    return await this.nonceRepository.save(newNonce);
  }
  async isNonceUsed(userId: number, nonce: number): Promise<boolean> {
    const nonceEntity = await this.nonceRepository
      .createQueryBuilder('nonce')
      .where('nonce.userId = :userId', { userId: userId })
      .andWhere('nonce.nonce = :nonce', { nonce: nonce })
      .getOne();
    if (!nonceEntity) {
      return false;
    } else {
      return true;
    }
  }
}
