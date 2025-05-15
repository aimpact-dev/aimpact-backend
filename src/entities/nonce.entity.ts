import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
  @Column({ type: 'timestamp', nullable: true })
  dateOfUsage?: Date;

  @ApiProperty({
    description: 'The nonce which was used by the owner',
    example: 16,
  })
  @Column({ type: 'varchar' })
  nonce: string;

  @ApiProperty({
    description: 'Address of the user',
    example: '7HmYsWHYZzixB3px79Y9sx91puwvLtv4ikLB9evx1vX4',
  })
  @Column({ type: 'varchar' })
  address: string;

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
