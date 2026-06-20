export type Review = {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type PaginatedReviewResponse = {
  data: Review[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
};
