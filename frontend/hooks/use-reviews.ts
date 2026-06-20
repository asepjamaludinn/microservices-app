"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Review } from "@/types/review";
import { getReviews } from "@/services/reviews.service";

export function useReviews() {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  const fetchReviews = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const data = await getReviews(page, search);
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
    const delayDebounceFn = setTimeout(() => {
      fetchReviews(1, searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchReviews]);

  return {
    reviews,
    loading,
    currentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    fetchReviews,
  };
}
