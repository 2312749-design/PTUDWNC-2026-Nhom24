export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  traceId?: string;
}
