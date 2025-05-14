import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findByWalletAddress(wallet: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    createUserWithSolanaWallet(wallet: string, signedMessage: string): Promise<User>;
}
