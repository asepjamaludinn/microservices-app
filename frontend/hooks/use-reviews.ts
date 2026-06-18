"use client";

import { useCallback, useEffect, useState } from "react";
import { Review } from "@/types/review";
import { getReviews } from "@/services/reviews.service";

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await getReviews(page);
      setReviews(data.reviews);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    currentPage,
    totalPages,
    fetchReviews,
  };
}
