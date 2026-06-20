import { ReceiptText, ArrowLeft } from "lucide-react";
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
    <section className="relative w-full overflow-hidden bg-[#fff4dc] px-6 py-12">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle,#cf432f_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 rounded-[2rem] border-2 border-black bg-[#cf432f] p-8 text-[#fff4dc] shadow-[8px_8px_0_#000]">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-[#ffdc65]">
            Your Orders
          </p>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black uppercase leading-none tracking-tighter md:text-6xl">
                Riwayat Pesanan
              </h1>

              <p className="mt-4 max-w-2xl font-semibold leading-relaxed text-[#fff4dc]/80">
                Lacak status pesanan dan berikan ulasan untuk hidangan favorit
                Anda.
              </p>
            </div>

            <div className="hidden rounded-3xl border-2 border-black bg-[#fff4dc] p-5 text-[#cf432f] shadow-[5px_5px_0_#000] md:block">
              <ReceiptText size={54} />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border-2 border-black bg-white p-6 shadow-[8px_8px_0_#000]">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-black bg-[#fff4dc] text-[#cf432f] shadow-[5px_5px_0_#000]">
                <ReceiptText size={40} />
              </div>

              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-950">
                Belum Ada Pesanan
              </h2>

              <p className="mt-3 max-w-md font-semibold leading-relaxed text-slate-600">
                Yuk mulai pilih menu favoritmu dan buat pesanan pertama di
                BiteBox.
              </p>

              <Button
                onClick={() => setActiveSection("home")}
                className="mt-7 h-12 rounded-2xl border-2 border-black bg-[#cf432f] px-7 font-black uppercase text-[#fff4dc] shadow-[5px_5px_0_#000] hover:bg-[#b8321f]"
              >
                <ArrowLeft size={18} className="mr-2" />
                Pesan Sekarang
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
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
    </section>
  );
}
