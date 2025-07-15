import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('leaderboard')
@Index('idx_leaderboard_points_desc', ['points'], {})
export class Leaderboard {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @OneToOne(() => User, (user) => user.leaderboard, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('int', { default: 0 })
  points: number;

  @ApiProperty({
    description: 'Date when the nonce was created',
    example: '2024-01-20T18:00:00Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the nonce was updated',
    example: '2024-01-20T18:00:00Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
