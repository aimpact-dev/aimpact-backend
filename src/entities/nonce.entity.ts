import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity('nonce')
export class Nonce {
  @ApiProperty({
    description: 'Unique identifier for the tournament.',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Date when the nonce was used',
    example: '2024-01-20T18:00:00Z',
  })
  @Column({ type: 'timestamp' })
  dateOfUsage: Date;

  @ApiProperty({
    description: 'The nonce which was used by the owner',
    example: 16,
  })
  @Column({ type: 'bigint' })
  nonce: number;

  @ApiProperty({
    description: 'UUID of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column({ type: 'uuid' })
  userId: string;

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

  @ManyToOne(() => User, (user) => user.nonces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
