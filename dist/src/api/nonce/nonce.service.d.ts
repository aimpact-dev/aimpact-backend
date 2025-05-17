import { Nonce } from 'src/entities/nonce.entity';
import { Repository } from 'typeorm';
export declare class NonceService {
    private readonly nonceRepository;
    constructor(nonceRepository: Repository<Nonce>);
    addUsedNonce(address: string, nonce: string): Promise<void>;
    isNonceUsed(address: string, nonce: string): Promise<boolean>;
    createNewNonce(address: string): Promise<Nonce>;
}
