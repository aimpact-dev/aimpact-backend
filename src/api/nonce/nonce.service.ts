import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nonce } from 'src/entities/nonce.entity';
import { Repository } from 'typeorm';
import { generateNonce } from '../utils/generateMessage';

@Injectable()
export class NonceService {
  constructor(
    @InjectRepository(Nonce)
    private readonly nonceRepository: Repository<Nonce>,
  ) {}

  async addUsedNonce(address: string, nonce: string): Promise<void> {
    const userNonce = await this.nonceRepository.findOne({
      where: { nonce, address },
    });

    console.log(userNonce, userNonce?.dateOfUsage)
    if (!userNonce || userNonce?.dateOfUsage) {
      throw new Error(`The user with ${address} address already used nonce ${nonce}`);
    }
    let dateOfUsage = new Date();
    dateOfUsage = new Date(
      dateOfUsage.getTime() + dateOfUsage.getTimezoneOffset() * 60000,
    );

    await this.nonceRepository.update(userNonce, {
      dateOfUsage,
    });
  }

  async isNonceUsed(address: string, nonce: string): Promise<boolean> {
    const nonceEntity = await this.nonceRepository
      .createQueryBuilder('nonce')
      .where('nonce.address = :address', { address })
      .andWhere('nonce.nonce = :nonce', { nonce })
      .andWhere('nonce.dateOfUsage IS NOT NULL')
      .getOne();
    console.log(nonceEntity, typeof nonceEntity, !!nonceEntity, "return false");
    return !!nonceEntity
  }

  async createNewNonce(address: string): Promise<Nonce> {
    const nonce = generateNonce();
    const nonceEntity = await this.nonceRepository.create({ address, nonce });
    await this.nonceRepository.save(nonceEntity);
    console.log(nonceEntity)
    return nonceEntity;
  }
}
