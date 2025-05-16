import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('funds_receipts')
export class FundsReceipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'decimal', precision: 18, scale: 9 })
  amount: number;

  @Column({ type: 'varchar', unique: true })
  transactionHash: string;

  @ManyToOne(() => User, (user) => user.receipts)
  @JoinColumn({ name: 'userId' })
  user: User;
}
