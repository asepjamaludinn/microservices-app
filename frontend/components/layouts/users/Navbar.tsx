"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Navbar() {
  const { user } = useCurrentUser();
  const { cart, setIsCartOpen } = useCartStore();

  return (
    <nav className="fixed top-0 w-full bg-[#FFFDF9]/90 backdrop-blur-md z-40 border-b border-orange-900/5">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/" className="relative w-36 h-12">
          <Image
            src="/images/logo.png"
            alt="BiteBox"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <div className="hidden md:flex gap-10 font-bold text-slate-700">
          <a href="#hero" className="hover:text-[#c94430] transition-colors">
            About
          </a>
          <a href="#menu" className="hover:text-[#c94430] transition-colors">
            Menu
          </a>
          <a href="#" className="hover:text-[#c94430] transition-colors">
            Blog
          </a>
          <a href="#" className="hover:text-[#c94430] transition-colors">
            Contact
          </a>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-800 hover:text-[#c94430] transition-colors"
            aria-label="Buka keranjang"
          >
            <ShoppingCart size={28} strokeWidth={2.5} />

            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#c94430] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FFFDF9]">
                {cart.length}
              </span>
            )}
          </button>

          <Link
            href={user ? "/dashboard" : "/login"}
            className="hidden sm:flex bg-[#c94430] hover:bg-[#b03a28] text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-wide shadow-lg shadow-[#c94430]/30 transition-transform hover:-translate-y-0.5"
          >
            {user ? "Dashboard" : "Get Started"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
