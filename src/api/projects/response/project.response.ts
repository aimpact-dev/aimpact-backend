import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/entities/project.entity';
import { number } from 'zod/v4';

export class ProjectResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description?: string;

  @ApiProperty({ nullable: true })
  category?: string;

  @ApiProperty({ nullable: true })
  image?: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: number })
  views: number;

  static fromObject(project: Project): ProjectResponse {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      category: project.category,
      image: project.image,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      views: project.views,
    };
  }
}
