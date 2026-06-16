"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  ChefHat,
  BookOpen,
  LineChart,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/orders", icon: ClipboardList },
    { name: "Tables", href: "/dashboard/tables", icon: UtensilsCrossed },
    { name: "Kitchen", href: "/dashboard/kitchen", icon: ChefHat },
    { name: "Menus", href: "/admin/dashboard/menus", icon: BookOpen },
    { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
      <div className="p-6">
        <div className="mb-6 flex">
          <div className="relative w-40 h-12">
            <Image
              src="/images/logo.png"
              alt="BiteBox Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-2.5 text-sm font-medium flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-[10px]">
              BB
            </div>
            <span className="tracking-tight text-slate-700">Pusat Utama</span>
          </div>
          <span className="text-slate-400">▼</span>
        </div>
      </div>

      <div className="flex-1 px-4 overflow-y-auto">
        <p className="text-sm font-semibold text-slate-400 mb-3 px-3 tracking-tight">
          Main menu
        </p>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#c94430] text-white shadow-md shadow-[#c94430]/20 font-medium"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <p className="text-sm font-semibold text-slate-400 mt-8 mb-3 px-3 tracking-tight">
          Preferences
        </p>
        <nav className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors font-medium">
            <HelpCircle size={18} strokeWidth={2} />
            <span className="tracking-tight">Help center</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors font-medium">
            <Settings size={18} strokeWidth={2} />
            <span className="tracking-tight">Settings</span>
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl transition-colors">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Juna"
            alt="Profile"
            className="w-10 h-10 rounded-full bg-slate-100 ring-2 ring-white shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate tracking-tight">
              Chef Juna
            </p>
            <p className="text-sm text-slate-500 truncate tracking-tight">
              Admin
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-[#c94430] hover:bg-[#c94430]/10 rounded-lg transition-colors group"
            title="Logout"
          >
            <LogOut
              size={18}
              strokeWidth={2.5}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
