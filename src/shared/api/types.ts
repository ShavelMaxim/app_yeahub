export interface PaginatedResponse<T> {
  total: number;
  page?: number;
  limit?: number;
  data: T[];
}

export interface ApiErrorBody {
  message?: string | string[];
  description?: string;
  statusCode?: number;
}
