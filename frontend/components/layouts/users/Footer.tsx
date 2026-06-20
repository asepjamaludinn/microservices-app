export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t-2 border-black bg-[#1b1b1b] px-6 py-14 text-[#fff4dc]">
      <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(circle,#fff4dc_1.4px,transparent_1.4px)] [background-size:24px_24px]" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            BiteBox
          </h2>
          <p className="mt-2 max-w-md text-sm font-semibold text-[#fff4dc]/70">
            Good Food, Happy Mood. Fresh meals made for every craving.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm font-black uppercase">
          <a href="#hero" className="transition hover:text-[#ffdc65]">
            About
          </a>
          <a href="#menu" className="transition hover:text-[#ffdc65]">
            Menu
          </a>
          <a href="#reviews" className="transition hover:text-[#ffdc65]">
            Reviews
          </a>
        </div>

        <p className="text-sm font-semibold text-[#fff4dc]/60">
          © {new Date().getFullYear()} BiteBox. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
