import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Project } from "./project.entity";
import { IsBoolean, IsNotEmpty } from "class-validator";

@Entity('nonce')
export class DeployAppRequest {
  @ApiProperty({
    description: 'Unique identifier for the tournament.',
    example: 1,
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    description: 'Project, that must be deployed in this request',
  })
  @OneToOne(() => Project, (project) => project.id)
  @IsNotEmpty()
  project?: Project;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty()
  @Column({ type: "boolean", default: false })
  @IsNotEmpty()
  isDeployed: boolean;

  @ApiProperty()
  @Column({ type: "string" })
  message: string;

  @ApiProperty()
  @Column({ type: "string" })
  finalUrl: string;
}