export type ResultPage<T> = {
  status: 200 | 400 | 500;
  data: T[];
  metadata: {
    total?: number;
    currentPage?: number;
    nextCursor?: number | null | undefined;
    pageSize: number;
    hasMore?: boolean;
  };
};
