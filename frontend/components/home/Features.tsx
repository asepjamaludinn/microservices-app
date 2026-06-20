import { Clock, ChefHat, Utensils } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Fast Service",
    description:
      "Pesanan langsung diproses tanpa perlu menunggu lama sehingga makanan sampai lebih cepat.",
  },
  {
    icon: ChefHat,
    title: "Top Quality",
    description:
      "Dimasak oleh chef berpengalaman dengan bahan pilihan dan standar kualitas terbaik.",
  },
  {
    icon: Utensils,
    title: "Dine & Take Away",
    description:
      "Nikmati hidangan favorit Anda di restoran maupun dibawa pulang dengan mudah.",
  },
];

export default function Features() {
  return (
    <section className="relative overflow-hidden bg-[#fff4dc] px-6 py-24">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle,#cf432f_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-[#cf432f]">
            Why BiteBox
          </p>

          <h2 className="mx-auto max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-tighter text-slate-950 md:text-7xl">
            Made For Food Lovers
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-[2rem] border-2 border-black bg-white p-8 shadow-[8px_8px_0_#000] transition duration-300 hover:-translate-y-2"
              >
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-black bg-[#cf432f] text-[#fff4dc] shadow-[4px_4px_0_#000]">
                  <Icon size={38} strokeWidth={2.5} />
                </div>

                <h3 className="mb-4 text-3xl font-black uppercase leading-none text-slate-950">
                  {feature.title}
                </h3>

                <p className="text-base font-semibold leading-relaxed text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-8 h-2 w-20 rounded-full bg-[#cf432f]" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
