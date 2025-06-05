import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('s3_deployments')
export class S3Deployment {
  @PrimaryGeneratedColumn('uuid')
  projectId: string;

  @Column({ type: 'varchar', nullable: false })
  url: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => Project, (project) => project.s3Deployment)
  @JoinColumn({ name: 'projectId' })
  project?: Project;
}
