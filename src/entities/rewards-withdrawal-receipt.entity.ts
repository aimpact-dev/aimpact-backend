import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('rewards_withdrawal_receipts')
export class RewardsWithdrawalReceipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  RewardsWithdrawalReceipt;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'decimal', precision: 18, scale: 9 })
  amount: number;

  @Column({ type: 'varchar', unique: true })
  transactionHash: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.receipts)
  @JoinColumn({ name: 'userId' })
  user: User;
}
