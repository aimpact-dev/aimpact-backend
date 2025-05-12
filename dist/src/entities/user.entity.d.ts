import { Nonce } from './nonce.entity';
export declare class User {
    id: number;
    wallet: string;
    nonces: Nonce[];
}
