import { MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatOrderNumber } from "@/utils/order-formatters";

interface ReviewModalProps {
  isOpen: boolean;
  orderId: number | null;
  rating: number;
  setRating: (r: number) => void;
  comment: string;
  setComment: (c: string) => void;
  isSubmitting: boolean;
  submitReview: (e: React.FormEvent) => void;
  closeReviewModal: () => void;
}

export default function ReviewModal({
  isOpen,
  orderId,
  rating,
  setRating,
  comment,
  setComment,
  isSubmitting,
  submitReview,
  closeReviewModal,
}: ReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
        <h3 className="font-bold text-xl text-slate-900 mb-1 flex items-center gap-2">
          <MessageSquare className="text-[#c94430]" size={20} /> Beri Ulasan
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Bagaimana pengalaman Anda untuk Order {formatOrderNumber(orderId!)}?
        </p>

        <form onSubmit={submitReview} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={
                      star <= rating
                        ? "text-yellow-400 fill-current drop-shadow-sm"
                        : "text-slate-200"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Komentar
            </label>
            <div className="relative">
              <Textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ceritakan pengalaman rasa masakan atau pelayanan kami..."
                className="rounded-xl min-h-[100px] bg-slate-50 border-slate-200 resize-none pr-10"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeReviewModal}
              className="flex-1 rounded-xl h-11 font-bold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl h-11 bg-[#c94430] hover:bg-[#b03a28] text-white font-bold"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
