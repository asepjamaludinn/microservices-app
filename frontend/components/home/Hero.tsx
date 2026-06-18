export default function Hero() {
  return (
    <section
      id="hero"
      className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Text */}
        <div className="lg:col-span-7 relative z-10">
          <div className="absolute -top-12 md:-top-8 right-10 md:right-32 bg-[#c94430] text-white font-black text-sm md:text-base px-6 py-2 transform rotate-12 rounded-xl shadow-xl border-2 border-white">
            ORDER NOW
          </div>

          <h1 className="text-6xl md:text-[110px] font-black text-slate-900 leading-[0.85] tracking-tighter uppercase mb-8">
            Flavors <br />
            Speak <br />
            Louder@
          </h1>

          <p className="text-[#c94430] font-semibold text-lg md:text-xl max-w-lg leading-relaxed">
            Craving something delicious? BiteBox brings you the tastiest dishes,
            curated from the best chefs and local favorites.
          </p>
        </div>

        {/* Right Video */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-yellow-400 rounded-[40px] transform translate-x-4 translate-y-4"></div>
          <div className="relative h-[300px] md:h-[450px] w-full rounded-[40px] overflow-hidden border-4 border-white shadow-2xl">
            <video
              src="/videos/hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              controlsList="nodownload"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
