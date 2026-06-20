"use client";

import { MessageSquare, Star, Quote, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useReviews } from "@/hooks/use-reviews";
import { formatDateTime } from "@/utils/date-formatters";

export default function ReviewsFeature() {
  const {
    reviews,
    loading,
    currentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    fetchReviews,
  } = useReviews();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="text-[#c94430]" /> Ulasan Pelanggan
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pantau ulasan dan *rating* yang diberikan pelanggan terhadap pesanan
            mereka.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Cari nama atau ulasan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#c94430]/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <MessageSquare size={48} className="opacity-20 mb-3" />
            <p className="font-semibold">Belum ada ulasan yang masuk.</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-900">
                      {review.customer_name}
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">
                      {formatDateTime(review.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-slate-200"
                        }
                      />
                    ))}
                  </div>
                  <div className="relative text-sm text-slate-600 italic font-medium leading-relaxed">
                    <Quote
                      size={16}
                      className="absolute -top-1 -left-2 text-slate-300 opacity-50"
                    />
                    <span className="relative z-10">{review.comment}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t flex justify-center gap-4 bg-slate-50">
            <Button
              disabled={currentPage === 1}
              onClick={() => fetchReviews(currentPage - 1)}
              variant="outline"
              className="rounded-xl"
            >
              Prev
            </Button>
            <span className="flex items-center text-sm font-semibold text-slate-500">
              Hal {currentPage} dari {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => fetchReviews(currentPage + 1)}
              variant="outline"
              className="rounded-xl"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
