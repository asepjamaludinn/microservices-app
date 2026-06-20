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
    <nav className="sticky top-0 w-full bg-[#FFFDF9]/90 backdrop-blur-md z-40 border-b border-orange-900/5">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div
          className="relative w-36 h-12 cursor-pointer transition-transform active:scale-95"
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

        <div className="flex items-center gap-5 sm:gap-8">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-800 hover:text-[#c94430] transition-colors"
            aria-label="Buka keranjang"
          >
            <ShoppingCart size={28} strokeWidth={2.5} />
            {cartLength > 0 && (
              <span className="absolute top-0 right-0 bg-[#c94430] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FFFDF9]">
                {cartLength}
              </span>
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 outline-none group cursor-pointer">
              <div className="w-11 h-11 bg-[#c94430] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md shadow-[#c94430]/20 transition-transform group-active:scale-95">
                {getInitials(user?.name)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  {user?.name || "Customer"}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {user?.email || "User Account"}
                </p>
              </div>
              <ChevronDown
                size={16}
                className="text-slate-400 hidden sm:block transition-transform group-data-[state=open]:rotate-180"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 mt-2 rounded-2xl p-2 bg-white shadow-xl border-slate-100 z-50"
            >
              <DropdownMenuItem
                onClick={() => setActiveSection("home")}
                className="cursor-pointer rounded-xl font-semibold py-2.5 px-3 focus:bg-orange-50 focus:text-[#c94430]"
              >
                <Utensils className="mr-2 h-4 w-4" /> Menu Makanan
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setActiveSection("orders")}
                className="cursor-pointer rounded-xl font-semibold py-2.5 px-3 focus:bg-orange-50 focus:text-[#c94430]"
              >
                <ReceiptText className="mr-2 h-4 w-4" /> Riwayat Pesanan
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-slate-100 mx-2" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-xl text-red-600 focus:text-red-700 focus:bg-red-50 font-semibold py-2.5 px-3"
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
