import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FundsReceipt } from 'src/entities/funds-receipt.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
export declare class BillingService implements OnModuleInit {
    private readonly configService;
    private readonly receiptRepository;
    private readonly userRepository;
    private readonly logger;
    private lastLamports;
    private connection;
    constructor(configService: ConfigService, receiptRepository: Repository<FundsReceipt>, userRepository: Repository<User>);
    onModuleInit(): Promise<void>;
    processFundReceipt(txHash: string, sender: string, amount: number, timestamp: Date): Promise<void>;
    findByTransactionHash(transactionHash: string): Promise<FundsReceipt | null>;
}
