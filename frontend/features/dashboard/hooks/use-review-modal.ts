import { useState } from "react";
import toast from "react-hot-toast";
import { createReview } from "@/services/reviews.service";

export function useReviewModal(userName?: string) {
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    orderId: number | null;
  }>({
    isOpen: false,
    orderId: null,
  });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openReviewModal = (orderId: number) => {
    setRating(5);
    setComment("");
    setReviewModal({ isOpen: true, orderId });
  };

  const closeReviewModal = () => {
    setReviewModal({ isOpen: false, orderId: null });
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModal.orderId || !userName) return;

    setIsSubmitting(true);
    try {
      await createReview({
        order_id: reviewModal.orderId,
        customer_name: userName, // TS Payload
        rating,
        comment,
      });
      toast.success("Terima kasih! Ulasan Anda berhasil dikirim.");
      closeReviewModal();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    reviewModal,
    rating,
    setRating,
    comment,
    setComment,
    isSubmitting,
    openReviewModal,
    closeReviewModal,
    submitReview,
  };
}
