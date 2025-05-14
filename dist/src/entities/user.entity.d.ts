import { Nonce } from './nonce.entity';
export declare class User {
    id: string;
    wallet: string;
    nonces: Nonce[];
    createdAt: Date;
    updatedAt: Date;
}
