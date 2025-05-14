import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export interface Message {
  id: string;
  content: string;
  role: string;
  annotations?: any;
  createdAt?: Date;
}

@Entity('project_chat')
export class ProjectChat {
  @PrimaryColumn({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'jsonb' })
  messages: Message[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
