import { Nonce } from 'src/entities/nonce.entity';
import { Repository } from 'typeorm';
export declare class NonceService {
    private readonly nonceRepository;
    constructor(nonceRepository: Repository<Nonce>);
    addUsedNonce(userId: number, nonce: number): Promise<Nonce>;
    isNonceUsed(userId: number, nonce: number): Promise<boolean>;
}
