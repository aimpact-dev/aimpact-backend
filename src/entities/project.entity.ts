import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProjectChat } from './project-chat.entity';
import { ProjectSnapshot } from './project-snapshot.entity';
import { DeployAppRequest } from './deploy-app-request.entity';
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
}
