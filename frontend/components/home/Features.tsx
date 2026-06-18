import { Clock, ChefHat, Utensils } from "lucide-react";

export default function Features() {
  return (
    <section className="bg-white border-t border-slate-100 py-20 px-6">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-10 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5">
            <Clock size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Hemat Waktu</h3>
          <p className="text-slate-500 text-sm">
            Pesanan langsung masuk ke dapur saat itu juga.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-5">
            <ChefHat size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Chef Profesional
          </h3>
          <p className="text-slate-500 text-sm">
            Disiapkan dengan resep standar tinggi yang terjaga.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5">
            <Utensils size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Dine In & Takeaway
          </h3>
          <p className="text-slate-500 text-sm">
            Fleksibilitas menikmati hidangan di mana saja.
          </p>
        </div>
      </div>
    </section>
  );
}
