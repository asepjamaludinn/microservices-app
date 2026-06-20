import MenuList from "@/components/home/MenuList";

export default function UserHomeSection() {
  return (
    <div className="animate-in fade-in duration-500">
      <section className="relative overflow-hidden bg-[#fff4dc] px-6 pb-8 pt-10">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle,#cf432f_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

        <div className="relative z-10 mx-auto max-w-7xl rounded-[2rem] border-2 border-black bg-white p-8 shadow-[8px_8px_0_#000]">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#cf432f]">
            Welcome Back
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase leading-none tracking-tighter text-slate-950 md:text-6xl">
            Mau Makan Apa Hari Ini?
          </h1>

          <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-slate-600">
            Pilih menu favoritmu, masukkan ke keranjang, lalu checkout dengan
            mudah.
          </p>
        </div>
      </section>

      <MenuList />
    </div>
  );
}
