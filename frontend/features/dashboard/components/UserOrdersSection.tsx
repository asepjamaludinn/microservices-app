import { ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserOrderCard from "./UserOrderCard";

interface UserOrdersSectionProps {
  orders: any[];
  setActiveSection: (section: "home" | "orders") => void;
  openReviewModal: (id: number) => void;
}

export default function UserOrdersSection({
  orders,
  setActiveSection,
  openReviewModal,
}: UserOrdersSectionProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#c94430] rounded-3xl p-8 text-white shadow-md mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Riwayat Pesanan
          </h1>
          <p className="text-white/80">
            Lacak status pesanan dan berikan ulasan untuk hidangan favorit Anda.
          </p>
        </div>
        <div className="absolute right-[-5%] top-[-20%] text-white/10">
          <ReceiptText size={180} />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <ReceiptText size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">Anda belum memiliki riwayat pesanan.</p>
            <Button
              onClick={() => setActiveSection("home")}
              variant="link"
              className="mt-2 text-[#c94430] font-bold"
            >
              Pesan Sekarang
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <UserOrderCard
                key={order.id}
                order={order}
                openReviewModal={openReviewModal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
