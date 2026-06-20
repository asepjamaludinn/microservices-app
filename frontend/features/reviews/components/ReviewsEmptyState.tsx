import { MessageSquare } from "lucide-react";

export default function ReviewsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
      <MessageSquare size={48} className="opacity-20 mb-3" />
      <p className="font-semibold">Belum ada ulasan yang masuk.</p>
    </div>
  );
}
