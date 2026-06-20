import ReviewCard from "./ReviewCard";

interface ReviewsListProps {
  reviews: any[];
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <div className="flex flex-col">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
