/* eslint-disable max-classes-per-file */
import { ApiResponseProperty } from '@nestjs/swagger';
import { PagePaginationParameters } from '@shared/rest/pagination/page-pagination.parameters';
import { PaginationVariants } from '@shared/types/pagination.type';
import { CursorPaginationParameters } from '@shared/rest/pagination/cursor-pagination.parameters';
import { buildCursorId } from '@shared/rest/pagination/paginate-data-with-cursor';

class PaginatedResponseMetadata {
  @ApiResponseProperty()
  pageSize: number;

  @ApiResponseProperty()
  page?: number | null;

  @ApiResponseProperty()
  cursor?: string | null;

  @ApiResponseProperty()
  total: number;
}

export class Paginated<T> {
  data: T[];

  @ApiResponseProperty({
    type: PaginatedResponseMetadata,
  })
  pagination: {
    pageSize: number;
    page?: number | null;
    cursor?: string | null;
    total: number;
  } | null;

  public static fromObject<T>(
    data: T[],
    dataIdFields: Array<keyof T>,
    pagination: PaginationVariants,
    total: number,
  ): Paginated<T> {
    const model = new Paginated<T>();
    model.data = data;

    if (!pagination) {
      model.pagination = null;
    } else if (pagination instanceof CursorPaginationParameters) {
      model.pagination = {
        pageSize:
          total > (pagination.take ?? 0)
            ? (pagination.take ?? 0) > data?.length
              ? data?.length
              : (pagination.take ?? 0)
            : total,
        cursor: data?.length ? buildCursorId(data[data.length - 1], dataIdFields) : null,
        total,
      };
    } else if (pagination instanceof PagePaginationParameters) {
      model.pagination = {
        pageSize:
          total > (pagination.take ?? 0)
            ? (pagination.take ?? 0) > data?.length
              ? data?.length
              : (pagination.take ?? 0)
            : total,
        page: pagination.skip ? pagination.skip / (pagination.take ?? 1) + 1 : 0,
        total,
      };
    }

    return model;
  }
}
