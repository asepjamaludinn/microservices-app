export type ApiResponse<T> = {
  data: T;
  message?: string;
  error?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page?: number;
  total?: number;
};
