import { User } from './user.entity';
export declare class Nonce {
    id: number;
    dateOfUsage: Date;
    nonce: number;
    userId: number;
    user: User;
}
