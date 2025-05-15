import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FundsReceipt } from 'src/entities/funds-receipt.entity';
import { Repository } from 'typeorm';
export declare class BillingService implements OnModuleInit {
    private readonly configService;
    private readonly receiptRepository;
    private readonly logger;
    private connection;
    constructor(configService: ConfigService, receiptRepository: Repository<FundsReceipt>);
    onModuleInit(): Promise<void>;
}
