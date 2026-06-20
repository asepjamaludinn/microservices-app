export default function StripeBanner() {
  return (
    <section className="grid min-h-[520px] grid-cols-1 overflow-hidden md:grid-cols-2">
      {/* Left */}
      <div className="relative bg-[#cf432f] px-8 py-16 text-black md:px-16 lg:px-20">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle,#ffd48a_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

        <div className="relative z-10">
          <h2 className="mb-12 max-w-xl text-5xl font-black uppercase leading-[0.95] tracking-tighter md:text-6xl">
            Yumminess On <br />
            The Brain
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex gap-5 rounded-2xl border-2 border-black bg-[#ffd49b] p-4 shadow-[6px_6px_0_#000]">
              <img
                src="/images/placeholder-food.jpg"
                alt="BiteBox favorite menu"
                className="h-40 w-44 rounded-xl object-cover"
              />

              <div className="flex flex-col justify-between py-1">
                <div>
                  <h3 className="text-2xl font-black uppercase leading-none">
                    BiteBox <br />
                    Favorite
                  </h3>
                  <p className="mt-3 text-base font-medium leading-snug">
                    Fresh dishes made for your best mood.
                  </p>
                </div>

                <span className="w-max rounded-lg bg-[#cf432f] px-6 py-2 text-sm font-black text-black shadow-[0_6px_0_rgba(207,67,47,0.55)]">
                  Order
                </span>
              </div>
            </div>

            <div className="flex gap-5 rounded-2xl border-2 border-black bg-[#ffd49b] p-4 shadow-[6px_6px_0_#000]">
              <img
                src="/images/placeholder-food.jpg"
                alt="BiteBox grill menu"
                className="h-40 w-44 rounded-xl object-cover"
              />

              <div className="flex flex-col justify-between py-1">
                <div>
                  <h3 className="text-2xl font-black uppercase leading-none">
                    Fresh <br />
                    Meals
                  </h3>
                  <p className="mt-3 text-base font-medium leading-snug">
                    Tasty, warm, and ready to enjoy.
                  </p>
                </div>

                <span className="w-max rounded-lg bg-[#cf432f] px-6 py-2 text-sm font-black text-black shadow-[0_6px_0_rgba(207,67,47,0.55)]">
                  Menu
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="relative bg-[#ffdc65] px-8 py-16 text-black md:px-16 lg:px-28">
        <div className="relative z-10 flex h-full flex-col justify-center">
          <h2 className="max-w-2xl text-5xl font-black uppercase leading-[1.02] tracking-tighter md:text-6xl lg:text-7xl">
            You Can{" "}
            <span className="text-transparent [-webkit-text-stroke:1.5px_#000]">
              Feel
            </span>
            <br />
            <span className="text-transparent [-webkit-text-stroke:1.5px_#000]">
              The
            </span>{" "}
            Love From <br />
            Our Grill
          </h2>

          <p className="mt-16 max-w-2xl text-lg font-medium leading-relaxed">
            BiteBox is more than just a restaurant — it is a place where fresh
            flavors meet comfort food. Our menu is crafted for food lovers,
            families, and anyone who wants delicious meals fast.
          </p>
        </div>

        <div className="absolute bottom-6 right-[-60px] h-56 w-56 opacity-25">
          <div className="h-full w-full rounded-full border-[26px] border-[#fff4bc]" />
        </div>
      </div>
    </section>
  );
}
