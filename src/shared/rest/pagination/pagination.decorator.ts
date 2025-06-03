import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

import { PaginationType, PaginationVariants } from '@shared/types/pagination.type';

import { CursorPaginationParameters } from '@shared/rest/pagination/cursor-pagination.parameters';
import { PagePaginationParameters } from '@shared/rest/pagination/page-pagination.parameters';
import { paginationConfig } from '@shared/rest/pagination/pagination.config';

type DecoratorParams = {
  type?: PaginationType;
  isOptional?: boolean;
};

const DEFAULT_PAGE_SIZE = paginationConfig.defaultPageSize;
const DEFAULT_PAGE_NUMBER = paginationConfig.defaultPageNumber;

export const Pagination = createParamDecorator<DecoratorParams>(
  // eslint-disable-next-line complexity
  (data: DecoratorParams, context: ExecutionContext): PaginationVariants => {
    const request = context.switchToHttp().getRequest();
    const { cursor, page, pageSize } = request.query;

    if (data?.isOptional && !cursor && !page && !pageSize) {
      return null as unknown as PaginationVariants;
    }

    if (!data?.type && cursor && page) {
      throw new BadRequestException('Incorrect pagination parameters. Use only one type cursor or page');
    }

    if (cursor || data.type === 'cursor') {
      return CursorPaginationParameters.fromObject({
        pageSize: pageSize ? parseInt(pageSize, 10) : DEFAULT_PAGE_SIZE,
        cursor: cursor || null,
      });
    }

    if (page || data.type === 'page') {
      return PagePaginationParameters.fromObject({
        pageSize: pageSize ? parseInt(pageSize, 10) : DEFAULT_PAGE_SIZE,
        page: page ? parseInt(page, 10) : DEFAULT_PAGE_NUMBER,
      });
    }

    return PagePaginationParameters.fromObject({
      pageSize: pageSize ? parseInt(pageSize, 10) : DEFAULT_PAGE_SIZE,
      page: DEFAULT_PAGE_NUMBER,
    });
  },
);
