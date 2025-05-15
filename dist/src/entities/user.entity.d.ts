import { Project } from './project.entity';
import { FundsReceipt } from './funds-receipt.entity';
export declare class User {
    id: string;
    wallet: string;
    createdAt: Date;
    updatedAt: Date;
    projects: Project[];
    receipts: FundsReceipt[];
}
