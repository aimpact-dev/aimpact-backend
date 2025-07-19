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


export type DeploymentStatus = "QUEUED" | "BUILDING" | "ERROR" | "INITIALIZING" | "READY" | "CANCELED";

export type DeploymentLog = {
  type: string;
  message: string;
  timestamp: Date;
  level?: string | null;
};

export type Provider = 'Vercel' | 'ICP';

@Entity('deploy_app_request')
export class DeployAppRequest {
  @PrimaryGeneratedColumn('uuid')
  projectId: string;

  @Column({ type: 'varchar', nullable: false })
  deploymentId: string;

  @Column({type: 'varchar', nullable: false })
  status: DeploymentStatus;

  @Column({ type: 'boolean', default: false })
  isDeployed: boolean;

  @Column({ type: 'varchar', nullable: true })
  message?: string;

  @Column({ type: 'jsonb', nullable: true })
  logs?: Array<DeploymentLog>;

  @Column({ type: 'varchar', nullable: true })
  finalUrl?: string | null;

  @Column({ type: 'varchar', nullable: false, default: 'Vercel' })
  provider: Provider;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => Project, (project) => project.deployAppRequest)
  @JoinColumn({ name: 'projectId' })
  project?: Project;
}
