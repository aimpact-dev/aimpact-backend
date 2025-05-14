import { User } from './user.entity';
export declare class Nonce {
    id: number;
    dateOfUsage: Date;
    nonce: number;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
