import { Star, MessageSquare } from "lucide-react";

type ReviewCardProps = {
  review: {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    customer_name: string;
    menu: {
      name: string;
      category_name: string;
      image_url?: string | null;
      total_reviews: number;
      overall_rating: number;
    };
  };
};

export default function ReviewCard({ review }: ReviewCardProps) {
  const menu = review.menu;

  return (
    <div className="grid grid-cols-1 gap-4 border-b border-slate-100 bg-white px-5 py-4 transition-colors last:border-b-0 hover:bg-slate-50/60 md:grid-cols-[120px_240px_1fr] md:items-start">
      <div className="h-28 w-28 overflow-hidden rounded-2xl bg-slate-100 md:h-28 md:w-28">
        <img
          src={menu.image_url || "/images/placeholder-food.jpg"}
          alt={menu.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0">
        <h3 className="mb-1 text-lg font-bold leading-tight text-slate-900">
          {menu.name}
        </h3>

        <p className="mb-5 text-sm font-medium text-slate-400">
          {menu.category_name}
        </p>

        <div className="space-y-2 text-sm font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <MessageSquare size={15} className="text-slate-400" />
            <span>{menu.total_reviews} Reviews</span>
          </div>

          <div className="flex items-center gap-2">
            <Star size={15} className="fill-amber-500 text-amber-500" />
            <span>{menu.overall_rating} Overall Rate</span>
          </div>
        </div>
      </div>

      <div className="min-w-0 pt-0 md:pt-1">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={17}
                className={
                  i < review.rating
                    ? "fill-amber-500 text-amber-500"
                    : "fill-slate-200 text-slate-200"
                }
              />
            ))}
          </div>

          <span className="text-sm font-bold text-slate-600">
            {review.rating}/5
          </span>

          <span className="text-slate-300">•</span>

          <span className="text-sm font-medium text-slate-400">
            {review.created_at}
          </span>
        </div>

        <p className="mb-5 max-w-4xl text-base font-medium leading-relaxed text-slate-500">
          {review.comment}
        </p>

        <p className="text-sm font-bold text-slate-900">
          {review.customer_name}
        </p>
      </div>
    </div>
  );
}
