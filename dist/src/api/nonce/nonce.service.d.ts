import { Nonce } from 'src/entities/nonce.entity';
import { Repository } from 'typeorm';
export declare class NonceService {
    private readonly nonceRepository;
    constructor(nonceRepository: Repository<Nonce>);
    addUsedNonce(userId: string, nonce: number): Promise<Nonce>;
    isNonceUsed(userId: string, nonce: number): Promise<boolean>;
}
