"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Navbar() {
  const { user } = useCurrentUser();
  const { cart, setIsCartOpen } = useCartStore();

  return (
    <nav className="fixed left-0 top-0 z-40 w-full px-4 pt-4">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between rounded-[1.5rem] border-2 border-black bg-[#fff4dc]/90 px-5 shadow-[6px_6px_0_#000] backdrop-blur-md md:px-7">
        <Link href="/" className="relative h-12 w-36">
          <Image
            src="/images/logo.png"
            alt="BiteBox"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 rounded-full border-2 border-black bg-white px-8 py-3 text-sm font-black uppercase text-slate-900 shadow-[4px_4px_0_#000] md:flex">
          <a href="#hero" className="transition hover:text-[#cf432f]">
            About
          </a>
          <a href="#menu" className="transition hover:text-[#cf432f]">
            Menu
          </a>
          <a href="#reviews" className="transition hover:text-[#cf432f]">
            Reviews
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-white text-slate-950 shadow-[4px_4px_0_#000] transition hover:-translate-y-0.5"
            aria-label="Buka keranjang"
          >
            <ShoppingCart size={23} strokeWidth={2.8} />

            {cart.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-[#cf432f] text-[10px] font-black text-white">
                {cart.length}
              </span>
            )}
          </button>

          <Link
            href={user ? "/dashboard" : "/login"}
            className="hidden h-12 items-center justify-center gap-2 rounded-2xl border-2 border-black bg-[#cf432f] px-6 text-sm font-black uppercase text-[#fff4dc] shadow-[4px_4px_0_#000] transition hover:-translate-y-0.5 sm:flex"
          >
            {user ? "Dashboard" : "Get Started"}
            <ArrowRight size={16} strokeWidth={3} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
