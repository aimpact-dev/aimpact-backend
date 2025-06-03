import { CursorPaginationParameters } from '@shared/rest/pagination/cursor-pagination.parameters';
import { PagePaginationParameters } from '@shared/rest/pagination/page-pagination.parameters';

export type PaginationType = 'cursor' | 'page';

export type PaginationVariants = CursorPaginationParameters | PagePaginationParameters;
