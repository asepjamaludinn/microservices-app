"use client";

import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { getReviews } from "@/services/reviews.service";
import type { Review } from "@/types/review";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews(1)
      .then((data) => {
        const bestReviews = data.reviews
          .filter((r) => r.rating >= 4)
          .slice(0, 3);
        setReviews(bestReviews);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
            What They Say
          </h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            Dengarkan pengalaman langsung dari para pelanggan setia BiteBox.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col relative"
            >
              <Quote
                className="absolute top-6 right-6 text-slate-100"
                size={40}
              />

              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-200"
                    }
                  />
                ))}
              </div>

              <p className="text-slate-700 italic font-medium leading-relaxed flex-1 mb-6 z-10">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c94430]/10 flex items-center justify-center text-[#c94430] font-bold">
                  {review.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">
                    {review.customer_name}
                  </h4>
                  <p className="text-xs text-slate-400">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
