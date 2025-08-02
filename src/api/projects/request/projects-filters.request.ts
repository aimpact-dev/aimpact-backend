import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ProjectOwnership {
  ALL = 'all',
  OWNED = 'owned',
}

export class ProjectsFiltersRequest {
  @ApiProperty({
    enum: ProjectOwnership,
    default: ProjectOwnership.ALL,
    description: 'Filter by ownership. User must be logged in to use ownership=owned',
  })
  @IsOptional()
  @IsEnum(ProjectOwnership)
  ownership: ProjectOwnership = ProjectOwnership.ALL;
}
