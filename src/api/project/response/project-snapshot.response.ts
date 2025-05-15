import { IsDate, IsNotEmptyObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ProjectSnapshot } from 'src/entities/project-snapshot.entity';

export class ProjectSnapshotResponse {
  @ApiProperty()
  projectId: string;

  @ApiProperty()
  files: object;

  @ApiProperty({ nullable: true })
  summary?: string;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  static fromObject(projectSnapshot: ProjectSnapshot): ProjectSnapshotResponse {
    return {
      projectId: projectSnapshot.projectId,
      files: projectSnapshot.files,
      summary: projectSnapshot.summary,
      updatedAt: projectSnapshot.updatedAt,
    };
  }
}
