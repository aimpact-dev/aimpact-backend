interface CursorPaginationParametersBuilder {
  pageSize: number | null;
  cursor: string | null;
}

export class CursorPaginationParameters {
  take: number | null;

  skip: number | null;

  cursor: { id: string } | null;

  public static fromObject(obj: CursorPaginationParametersBuilder): CursorPaginationParameters {
    const model = new CursorPaginationParameters();
    if (obj.cursor) {
      model.cursor = {
        id: obj.cursor,
      };
      model.skip = 1;
    }
    if (obj.pageSize) {
      model.take = obj.pageSize;
    }
    return model;
  }
}
