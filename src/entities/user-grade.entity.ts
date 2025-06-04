import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_grades')
export class UserGrade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'integer' })
  grade: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @JoinColumn({ name: 'userId' })
  user: User;
}
