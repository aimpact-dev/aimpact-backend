import { ApiProperty } from '@nestjs/swagger';
import { ProjectSnapshot } from 'src/entities/project-snapshot.entity';

export class ProjectSnapshotResponse {
  @ApiProperty()
  projectId: string;

  @ApiProperty()
  files: object;

  @ApiProperty()
  chatIndex: string;

  @ApiProperty({ nullable: true })
  summary?: string;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  static fromObject(projectSnapshot: ProjectSnapshot): ProjectSnapshotResponse {
    return {
      projectId: projectSnapshot.projectId,
      files: projectSnapshot.files,
      chatIndex: projectSnapshot.chatIndex,
      summary: projectSnapshot.summary,
      updatedAt: projectSnapshot.updatedAt,
    };
  }
}
