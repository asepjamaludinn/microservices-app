"use client";

import { useReviews } from "@/hooks/use-reviews";
import ReviewsHeader from "./ReviewsHeader";
import ReviewsSkeleton from "./ReviewsSkeleton";
import ReviewsEmptyState from "./ReviewsEmptyState";
import ReviewsList from "./ReviewsList";
import ReviewsPagination from "./ReviewsPagination";

export default function ReviewsFeature() {
  const {
    reviews,
    loading,
    currentPage,
    totalPages,
    totalItems,
    perPage,
    searchQuery,
    setSearchQuery,
    fetchReviews,
  } = useReviews();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ReviewsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <ReviewsSkeleton />
        ) : reviews.length === 0 ? (
          <ReviewsEmptyState />
        ) : (
          <ReviewsList reviews={reviews} />
        )}

        <ReviewsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          perPage={perPage}
          fetchReviews={fetchReviews}
        />
      </div>
    </div>
  );
}
