import { Banknote, SmartphoneNfc, CreditCard } from "lucide-react";

interface POSPaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PAYMENT_METHODS = [
  { id: "cash", label: "Tunai", icon: Banknote },
  { id: "qris", label: "QRIS", icon: SmartphoneNfc },
  { id: "card", label: "Kartu", icon: CreditCard },
];

export default function POSPaymentMethod({
  paymentMethod,
  setPaymentMethod,
}: POSPaymentMethodProps) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-bold text-slate-400 mb-2.5 uppercase tracking-wider">
        Metode Pembayaran
      </p>
      <div className="grid grid-cols-3 gap-2">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => setPaymentMethod(method.id)}
            className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs cursor-pointer font-semibold transition-all ${
              paymentMethod === method.id
                ? "border-[#c94430] bg-[#c94430]/10 text-[#c94430] shadow-sm"
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            <method.icon size={20} strokeWidth={2.5} /> {method.label}
          </button>
        ))}
      </div>
    </div>
  );
}
