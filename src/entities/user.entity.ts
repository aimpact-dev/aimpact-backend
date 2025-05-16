import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';
import { FundsReceipt } from './funds-receipt.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  wallet: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionStart: Date;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionEnd: Date;

  @OneToMany(() => Project, (project) => project.userId)
  projects: Project[];

  @OneToMany(() => FundsReceipt, (receipt) => receipt.userId)
  receipts: FundsReceipt[];
}
