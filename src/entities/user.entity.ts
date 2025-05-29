import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne, JoinColumn, Unique
} from 'typeorm';
import { Project } from './project.entity';
import { FundsReceipt } from './funds-receipt.entity';
import { RewardsWithdrawalReceipt } from './rewards-withdrawal-receipt.entity';


const randomInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  wallet: string;

  @Column({ type: 'integer', default: 0 })
  messagesLeft: number;

  @Unique('uq_invite_code', ['inviteCode'])
  @Column({type: 'varchar', length: 6, nullable: false, default: () => 'randomInviteCode()'})
  inviteCode: string;

  @Column({ type: 'varchar', nullable: true })
  referrerId: string;

  @Column({ type: 'integer', nullable: false, default: 0 })
  discountPercent: number;

  @Column({ type: 'decimal', precision: 18, scale: 0, nullable: false, default: 0 })  // Store rewards in lamports
  referralsRewards: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => User, (user) => user.referrer, { onDelete: 'SET NULL' })
  referrals: User[];

  @ManyToOne(() => User, (user) => user.referrals, { onDelete: 'SET NULL'})
  @JoinColumn({ name: 'referrerId', foreignKeyConstraintName: 'fk_referrerId', })
  referrer?: User;

  @OneToMany(() => FundsReceipt, (receipt) => receipt.user)
  receipts: FundsReceipt[];

  @OneToMany(() => RewardsWithdrawalReceipt, (receipt) => receipt.user)
  withdraws: RewardsWithdrawalReceipt[];
}
