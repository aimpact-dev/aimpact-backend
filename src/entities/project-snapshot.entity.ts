import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('project_snapshot')
export class ProjectSnapshot {
  @PrimaryColumn({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'jsonb' })
  files: any;

  @Column({ type: 'varchar', nullable: true })
  summary?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
