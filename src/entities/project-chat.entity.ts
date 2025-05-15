import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';

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

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb' })
  messages: any[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => Project, (project) => project.projectChat)
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
