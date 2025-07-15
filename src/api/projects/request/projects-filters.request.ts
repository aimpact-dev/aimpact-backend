import { IsDate, IsEnum, IsNotEmptyObject, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ClosedEnum } from '@vercel/sdk/types/enums';

type sortBy = 'createdAt' | 'updatedAt' | 'name';
type sortOrder = 'asc' | 'desc';

export const ownershipOptions = {
  all: 'all',
  owned: 'owned',
} as const;
export type Ownership = ClosedEnum<typeof ownershipOptions>;

export const sortByOptions = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  name: 'name',
} as const;
export type SortBy = ClosedEnum<typeof sortByOptions>;

export const sortOrderOptions = {
  asc: 'ASC',
  desc: 'DESC',
} as const;
export type SortOrder = ClosedEnum<typeof sortOrderOptions>;

export class ProjectsFiltersRequest {
  @ApiProperty({
    enum: ownershipOptions,
    default: 'all',
    description: 'Filter by ownership. User must be logged in to use ownership=owned',
  })
  @IsString()
  ownership: Ownership = 'all';

  @ApiProperty({ enum: sortByOptions, default: 'createdAt' })
  @IsString()
  sortBy: SortBy = 'createdAt';

  @ApiProperty({ enum: sortOrderOptions, default: 'DESC' })
  @IsString()
  sortOrder: SortOrder = 'DESC';
}
