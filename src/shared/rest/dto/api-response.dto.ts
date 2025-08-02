import { applyDecorators, HttpException, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export class ApiResponse<T, E = null> {
  data?: T | T[] | null;

  pagination?: {
    page?: number;
    pageSize?: number;
    total?: number;
    cursor?: number;
  };

  error?: E | null;

  static ok<T, E = null>(data?: T): ApiResponse<T, E> {
    const apiResp = new ApiResponse<T, E>();

    apiResp.data = data;

    apiResp.error = null;
    return apiResp;
  }

  static error<E, T = null>(error: E): ApiResponse<T, E> {
    const apiResp = new ApiResponse<T, E>();
    apiResp.data = null;
    apiResp.error = error;
    return apiResp;
  }
}

export const ApiResponseDoc = <DataType extends Type>(
  data: DataType,
  params: { isArray?: boolean } = { isArray: false },
): MethodDecorator =>
  applyDecorators(
    ApiExtraModels(data, ApiResponse),
    ApiExtraModels(HttpException, ApiResponse),
    ApiOkResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(ApiResponse) }],
        oneOf: [
          {
            properties: {
              data: params.isArray
                ? {
                    type: 'array',
                    items: {
                      type: typeof data,
                      $ref: getSchemaPath(data),
                    },
                  }
                : {
                    type: typeof data,
                    $ref: getSchemaPath(data),
                  },
            },
          },
          {
            properties: {
              error: {
                type: typeof HttpException,
                $ref: getSchemaPath(HttpException),
              },
            },
          },
        ],
      },
    }),
  );
