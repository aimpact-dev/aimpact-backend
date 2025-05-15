import { User } from './user.entity';
export declare class FundsReceipt {
    id: string;
    userId: string;
    timestamp: Date;
    amount: number;
    transactionHash: string;
    user: User;
}
