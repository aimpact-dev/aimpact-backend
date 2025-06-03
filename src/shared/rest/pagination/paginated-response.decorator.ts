/* eslint-disable max-lines-per-function */
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';

import { PaginationType } from '@shared/types/pagination.type';
import { Paginated } from '@shared/rest/pagination/paginated.output';
import { paginationConfig } from '@shared/rest/pagination/pagination.config';

export const PaginatedResponse = (type: Type, paginationType?: PaginationType): MethodDecorator => {
  const apiQueryParams: MethodDecorator[] = [];

  if (paginationType) {
    apiQueryParams.push(
      ApiQuery({
        name: 'pageSize',
        schema: {
          default: paginationConfig.defaultPageSize,
          type: 'number',
          minimum: 1,
        },
        required: false,
      }),
    );
    if (paginationType === 'cursor') {
      apiQueryParams.push(
        ApiQuery({
          name: 'cursor',
          schema: { default: null, type: 'string' },
          required: false,
        }),
      );
    }

    if (paginationType === 'page') {
      apiQueryParams.push(
        ApiQuery({
          name: 'page',
          schema: {
            default: paginationConfig.defaultPageNumber,
            type: 'number',
            minimum: 0,
          },
          required: false,
        }),
      );
    }
  }

  return applyDecorators(
    ApiExtraModels(type, Paginated),
    ...apiQueryParams,
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(Paginated) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(type) },
              },
            },
          },
        ],
      },
    }),
  );
};
