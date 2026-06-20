import { Suspense } from "react";
import ReviewsFeature from "@/features/reviews/components/ReviewsFeature";

export const metadata = { title: "Customer Reviews | Admin Dashboard" };

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewsFeature />
    </Suspense>
  );
}
