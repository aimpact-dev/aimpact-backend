import { CursorPaginationParameters } from './cursor-pagination.parameters';

/* eslint-disable no-restricted-syntax */
export const buildCursorId = <T>(dataItem: T, dataIdFields: Array<keyof T>): string => {
  let id = '';

  for (const field of dataIdFields) {
    id += dataItem[field];
  }

  return id;
};

export const paginateDataWithCursor = <T>(
  data: T[],
  dataIdFields: Array<keyof T>,
  pagination: CursorPaginationParameters,
): T[] => {
  let startIndex = pagination.skip ?? 0;

  if (pagination.cursor) {
    const cursorIndex = data.findIndex((item) => buildCursorId(item, dataIdFields) === pagination.cursor?.id);
    if (cursorIndex !== -1) {
      startIndex = cursorIndex + 1;
    }
  }

  const endIndex = startIndex + (pagination.take ?? data.length);

  if (startIndex === 0 && endIndex >= data.length) {
    return data;
  }

  return data.slice(startIndex, endIndex);
};
