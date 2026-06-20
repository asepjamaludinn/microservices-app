"use client";

import { useEffect, useState } from "react";
import { Star, Quote, MessageCircle } from "lucide-react";
import { getReviews } from "@/services/reviews.service";
import type { Review } from "@/types/review";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews(1)
      .then((data) => {
        const bestReviews = data.reviews
          .filter((review) => review.rating >= 4)
          .slice(0, 3);

        setReviews(bestReviews);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#fff4dc] px-6 py-24 text-slate-950">
      <div className="pointer-events-none absolute -left-10 top-10 text-[9rem] font-black uppercase leading-none tracking-tighter text-[#cf432f]/10 md:text-[14rem]">
        Reviews
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle,#cf432f_1.4px,transparent_1.4px)] [background-size:24px_24px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-[#cf432f]">
              Customer Voice
            </p>

            <h2 className="max-w-3xl text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-7xl">
              What They Say About BiteBox
            </h2>
          </div>

          <div className="max-w-md rounded-3xl border-2 border-black bg-white p-6 shadow-[8px_8px_0_#000]">
            <div className="mb-3 flex items-center gap-2">
              <MessageCircle className="text-[#cf432f]" size={22} />
              <span className="text-sm font-black uppercase text-[#cf432f]">
                Real Feedback
              </span>
            </div>

            <p className="text-base font-semibold leading-relaxed text-slate-700">
              Ulasan terbaik dari pelanggan yang sudah menikmati makanan dan
              layanan BiteBox.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          {reviews.map((review, index) => (
            <article
              key={review.id}
              className={`group relative flex min-h-[360px] flex-col rounded-[2rem] border-2 border-black bg-white p-7 shadow-[8px_8px_0_#000] transition duration-300 hover:-translate-y-2 ${
                index === 1 ? "md:mt-10 bg-[#cf432f] text-[#fff4dc]" : ""
              }`}
            >
              <Quote
                className={`absolute right-6 top-6 ${
                  index === 1 ? "text-[#fff4dc]/20" : "text-[#cf432f]/10"
                }`}
                size={58}
              />

              <div className="mb-7 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < review.rating
                        ? "fill-[#ffb000] text-[#ffb000]"
                        : index === 1
                          ? "fill-[#fff4dc]/20 text-[#fff4dc]/20"
                          : "fill-slate-200 text-slate-200"
                    }
                  />
                ))}

                <span
                  className={`ml-2 text-sm font-black ${
                    index === 1 ? "text-black" : "text-slate-800"
                  }`}
                >
                  {review.rating}/5
                </span>
              </div>

              <p
                className={`relative z-10 flex-1 text-lg font-bold leading-relaxed ${
                  index === 1 ? "text-black" : "text-slate-800"
                }`}
              >
                “{review.comment}”
              </p>

              <div className="mt-8 flex items-center gap-4 border-t border-dashed border-black/30 pt-6">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-black text-lg font-black shadow-[4px_4px_0_#000] ${
                    index === 1
                      ? "bg-[#fff4dc] text-[#cf432f]"
                      : "bg-[#cf432f] text-[#fff4dc]"
                  }`}
                >
                  {review.customer_name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h4
                    className={`text-base font-black ${
                      index === 1 ? "text-black" : "text-slate-950"
                    }`}
                  >
                    {review.customer_name}
                  </h4>

                  <p
                    className={`text-xs font-bold uppercase tracking-wide ${
                      index === 1 ? "text-black/70" : "text-slate-500"
                    }`}
                  >
                    Verified Customer
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
