import { ArrowRight, Play, Star } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#fff4dc] px-6 pb-20 pt-32 md:pb-28 md:pt-40"
    >
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle,#cf432f_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

      <div className="pointer-events-none absolute -left-10 top-24 text-[10rem] font-black uppercase leading-none tracking-tighter text-[#cf432f]/10 md:text-[16rem]">
        BiteBox
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-5 py-3 text-sm font-black uppercase text-[#cf432f] shadow-[5px_5px_0_#000]">
            <Star size={16} className="fill-[#ffb000] text-[#ffb000]" />
            Fresh Food Everyday
          </div>

          <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.82] tracking-tighter text-slate-950 md:text-[96px] lg:text-[120px]">
            Flavors <br />
            Speak <br />
            Louder
          </h1>

          <p className="mt-8 max-w-xl text-lg font-bold leading-relaxed text-slate-700 md:text-xl">
            Craving something delicious? BiteBox brings you warm, tasty, and
            freshly cooked meals made to lift your mood.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#menu"
              className="inline-flex h-16 items-center justify-center gap-3 rounded-2xl border-2 border-black bg-[#cf432f] px-8 text-sm font-black uppercase text-[#fff4dc] shadow-[7px_7px_0_#000] transition hover:-translate-y-1 hover:shadow-[10px_10px_0_#000]"
            >
              Order Now
              <ArrowRight size={19} strokeWidth={3} />
            </a>

            <a
              href="#menu"
              className="inline-flex h-16 items-center justify-center gap-3 rounded-2xl border-2 border-black bg-white px-8 text-sm font-black uppercase text-slate-950 shadow-[7px_7px_0_#000] transition hover:-translate-y-1 hover:shadow-[10px_10px_0_#000]"
            >
              View Menu
              <Play size={17} className="fill-slate-950" />
            </a>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            <div className="rounded-2xl border-2 border-black bg-white p-4 shadow-[5px_5px_0_#000]">
              <p className="text-3xl font-black text-slate-950">4.8</p>
              <p className="text-xs font-black uppercase text-slate-500">
                Rating
              </p>
            </div>

            <div className="rounded-2xl border-2 border-black bg-white p-4 shadow-[5px_5px_0_#000]">
              <p className="text-3xl font-black text-slate-950">Fast</p>
              <p className="text-xs font-black uppercase text-slate-500">
                Service
              </p>
            </div>

            <div className="rounded-2xl border-2 border-black bg-white p-4 shadow-[5px_5px_0_#000]">
              <p className="text-3xl font-black text-slate-950">Fresh</p>
              <p className="text-xs font-black uppercase text-slate-500">
                Meals
              </p>
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="absolute -right-4 -top-4 h-full w-full rounded-[2.5rem] border-2 border-black bg-[#ffdc65] shadow-[10px_10px_0_#000]" />

          <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-black bg-black shadow-[10px_10px_0_#000]">
            <div className="relative h-[360px] w-full md:h-[520px]">
              <video
                src="/videos/hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                controlsList="nodownload"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 rounded-3xl border-2 border-white/30 bg-white/20 p-5 text-white backdrop-blur-md">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ffdc65]">
                  BiteBox Special
                </p>

                <h3 className="mt-2 text-3xl font-black uppercase leading-none">
                  Good Food, <br />
                  Happy Mood
                </h3>
              </div>
            </div>
          </div>

          <div className="absolute -left-6 top-10 rotate-[-8deg] rounded-2xl border-2 border-black bg-[#cf432f] px-6 py-3 text-sm font-black uppercase text-[#fff4dc] shadow-[5px_5px_0_#000]">
            Order Now
          </div>
        </div>
      </div>
    </section>
  );
}
