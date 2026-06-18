"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  ChefHat,
  BookOpen,
  PackageOpen,
  LogOut,
  Settings,
  Receipt,
  Tags,
  History,
} from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useLogout } from "@/hooks/use-logout";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "POS", href: "/admin/dashboard/pos", icon: Receipt },
  { name: "Orders", href: "/admin/dashboard/orders", icon: ClipboardList },
  { name: "Tables", href: "/admin/dashboard/tables", icon: UtensilsCrossed },
  { name: "Categories", href: "/admin/dashboard/categories", icon: Tags },
  { name: "Menus", href: "/admin/dashboard/menus", icon: BookOpen },
  {
    name: "Inventory",
    href: "/admin/dashboard/inventory",
    icon: PackageOpen,
  },
  { name: "Audit Logs", href: "/admin/dashboard/audit-logs", icon: History },
];

function getInitials(name?: string) {
  if (!name) return "AD";

  const words = name.trim().split(" ");

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return name.substring(0, 2).toUpperCase();
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, loading } = useCurrentUser();
  const { handleLogout } = useLogout("/admin/login");

  const isSettingsActive = pathname.startsWith("/admin/dashboard/settings");

  if (loading) {
    return (
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0 opacity-0 transition-opacity duration-300">
        <div className="p-6">Memuat...</div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
      <div className="p-6">
        <div className="mb-6 flex">
          <div className="relative w-40 h-12">
            <Image
              src="/images/logo.png"
              alt="BiteBox Logo"
              fill
              sizes="160px"
              className="object-contain object-left"
              priority
            />
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 overflow-y-auto">
        <p className="text-sm font-semibold text-slate-400 mb-3 px-3 tracking-tight">
          Main menu
        </p>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);

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

        <nav className="space-y-1 pb-4">
          <Link
            href="/admin/dashboard/settings"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              isSettingsActive
                ? "bg-[#c94430] text-white shadow-md shadow-[#c94430]/20 font-medium"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
            }`}
          >
            <Settings size={18} strokeWidth={isSettingsActive ? 2.5 : 2} />
            <span className="tracking-tight">Settings</span>
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl transition-colors">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#c94430]/10 text-[#c94430] ring-2 ring-white shadow-sm font-bold tracking-tight text-sm">
            {getInitials(user?.name)}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate tracking-tight">
              {user?.name || "Admin"}
            </p>

            <p className="text-sm text-slate-500 truncate tracking-tight capitalize">
              {user?.role || "admin"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-[#c94430] hover:bg-[#c94430]/10 rounded-lg transition-colors group"
            title="Logout"
            aria-label="Logout"
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
