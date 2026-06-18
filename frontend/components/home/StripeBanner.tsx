export default function StripeBanner() {
  return (
    <div className="flex flex-col md:flex-row w-full text-3xl md:text-5xl font-black uppercase tracking-tighter shadow-inner">
      <div className="w-full md:w-1/2 bg-[#c94430] text-white py-8 px-8 md:text-right flex items-center md:justify-end">
        Yumminess On
      </div>
      <div className="w-full md:w-1/2 bg-[#FCD34D] text-slate-900 py-8 px-8 flex items-center">
        You Can Feel
      </div>
    </div>
  );
}
