import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne, JoinColumn, Unique,
  OneToOne
} from 'typeorm';
import { Project } from './project.entity';
import { FundsReceipt } from './funds-receipt.entity';
import { RewardsWithdrawalReceipt } from './rewards-withdrawal-receipt.entity';
import { Leaderboard } from './leaderboard.entity';


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

  @Column({ type: 'integer', default: 2 })
  messagesLeft: number;

  @Unique('uq_invite_code', ['inviteCode'])
  @Column({ type: 'varchar', length: 6, nullable: false, default: () => 'randomInviteCode()' })
  inviteCode: string;

  @Column({ type: 'varchar', nullable: true })
  referrerId: string;

  @Column({ type: 'integer', nullable: false, default: 0 })
  discountPercent: number;

  @Column({ type: 'decimal', precision: 18, scale: 0, nullable: false, default: 0 })  // Store rewards in lamports
  referralsRewards: number;

  @Column({ type: 'numeric', precision: 18, scale: 0, nullable: false, default: 0 })
  totalEarnedRewards: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => User, (user) => user.referrer, { onDelete: 'SET NULL' })
  referrals: User[];

  @ManyToOne(() => User, (user) => user.referrals, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'referrerId', foreignKeyConstraintName: 'fk_referrerId', })
  referrer?: User;

  @OneToMany(() => FundsReceipt, (receipt) => receipt.user)
  receipts: FundsReceipt[];

  @Column({ type: 'boolean', default: false })
  claimedFreeMessages: boolean;

  @OneToMany(() => RewardsWithdrawalReceipt, (receipt) => receipt.user)
  withdraws: RewardsWithdrawalReceipt[];

  @OneToOne(() => Leaderboard, (lb) => lb.user)
  leaderboard: Leaderboard;
}
