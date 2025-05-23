import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity('project_snapshot')
export class ProjectSnapshot {
  @PrimaryColumn({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'varchar'})
  filesPath: string;

  @Column({ type: 'varchar' })
  chatIndex: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => Project, (project) => project.projectSnapshot)
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
