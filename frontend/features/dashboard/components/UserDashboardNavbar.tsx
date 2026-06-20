"use client";

import Image from "next/image";
import {
  ShoppingCart,
  ChevronDown,
  Utensils,
  ReceiptText,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "../utils/user-dashboard-utils";

interface UserDashboardNavbarProps {
  user: any;
  cartLength: number;
  setIsCartOpen: (open: boolean) => void;
  setActiveSection: (section: "home" | "orders") => void;
  handleLogout: () => void;
}

export default function UserDashboardNavbar({
  user,
  cartLength,
  setIsCartOpen,
  setActiveSection,
  handleLogout,
}: UserDashboardNavbarProps) {
  return (
    <nav className="sticky top-0 z-40 w-full bg-[#fff4dc] px-4 py-4">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between rounded-[1.5rem] border-2 border-black bg-white px-5 shadow-[6px_6px_0_#000]">
        <div
          className="relative h-12 w-36 cursor-pointer transition active:scale-95"
          onClick={() => setActiveSection("home")}
        >
          <Image
            src="/images/logo.png"
            alt="BiteBox Logo"
            fill
            className="object-contain object-left"
            priority
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-[#fff4dc] text-slate-950 shadow-[4px_4px_0_#000] transition hover:-translate-y-0.5"
            aria-label="Buka keranjang"
          >
            <ShoppingCart size={24} strokeWidth={2.8} />

            {cartLength > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-[#cf432f] text-[10px] font-black text-white">
                {cartLength}
              </span>
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 rounded-2xl border-2 border-black bg-[#cf432f] px-3 py-2 text-[#fff4dc] shadow-[4px_4px_0_#000] outline-none transition hover:-translate-y-0.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-[#fff4dc] text-sm font-black text-[#cf432f]">
                {getInitials(user?.name)}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-black leading-tight">
                  {user?.name || "Customer"}
                </p>
                <p className="text-xs font-bold text-[#fff4dc]/75">
                  {user?.email || "User Account"}
                </p>
              </div>

              <ChevronDown size={16} className="hidden sm:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="z-50 mt-3 w-60 rounded-2xl border-2 border-black bg-white p-2 shadow-[6px_6px_0_#000]"
            >
              <DropdownMenuItem
                onClick={() => setActiveSection("home")}
                className="cursor-pointer rounded-xl px-3 py-3 font-black focus:bg-[#fff4dc] focus:text-[#cf432f]"
              >
                <Utensils className="mr-2 h-4 w-4" /> Menu Makanan
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setActiveSection("orders")}
                className="cursor-pointer rounded-xl px-3 py-3 font-black focus:bg-[#fff4dc] focus:text-[#cf432f]"
              >
                <ReceiptText className="mr-2 h-4 w-4" /> Riwayat Pesanan
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mx-2 my-2 bg-slate-200" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-xl px-3 py-3 font-black text-red-600 focus:bg-red-50 focus:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" /> Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
