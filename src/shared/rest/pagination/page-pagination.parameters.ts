interface PagePaginationParametersBuilder {
  pageSize: number | null;
  page: number | null;
}

export class PagePaginationParameters {
  take: number | null;

  page: number | null;

  skip: number | null;

  public static fromObject(obj: PagePaginationParametersBuilder): PagePaginationParameters {
    const model = new PagePaginationParameters();
    model.page = obj.page;
    if (obj.pageSize) {
      model.take = obj.pageSize;
    }
    if (obj.pageSize && obj.page && obj.page > 0) {
      model.skip = (obj.page - 1) * obj.pageSize;
    } else {
      model.skip = 0;
    }
    return model;
  }

  public toQueryParams(): { skip: number | null; take: number | null } {
    return {
      skip: this.skip,
      take: this.take,
    };
  }

  public toResponse(): { page: number | null; pageSize: number | null } {
    return {
      page: this.page,
      pageSize: this.take,
    };
  }
}
