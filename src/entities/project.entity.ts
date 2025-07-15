import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectChat } from './project-chat.entity';
import { ProjectSnapshot } from './project-snapshot.entity';
import { DeployAppRequest } from './deploy-app-request.entity';
import { User } from './user.entity';
import { S3Deployment } from './deploy-s3.entity';
@Entity('project')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', nullable: true })
  category?: string;

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'integer', default: 0 })
  views: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => ProjectChat, (projectChat) => projectChat.project)
  projectChat?: ProjectChat;

  @OneToOne(() => ProjectSnapshot, (projectSnapshot) => projectSnapshot.project)
  projectSnapshot?: ProjectSnapshot;

  @OneToOne(() => DeployAppRequest, (deployAppRequest) => deployAppRequest.project)
  deployAppRequest?: DeployAppRequest;

  @OneToOne(() => S3Deployment, (s3Deployment) => s3Deployment.project)
  s3Deployment?: S3Deployment;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'userId' })
  user: User;
}
