import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/entities/project.entity';

export class ProjectWithOwnerResponse {
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

  @ApiProperty({ type: String, example: '7HmYsWHYZzixB3px79Y9sx91puwvLtv4ikLB9evx1vX4' })
  projectOwnerAddress: string;


  static fromObject(project: Project): ProjectWithOwnerResponse {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      category: project.category,
      image: project.image,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      projectOwnerAddress: project.user.wallet,
    };
  }
}
