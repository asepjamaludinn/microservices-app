"use client";

import { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (res.ok && data.user) {
          setUser(data.user);
        }
      } catch (error) {}
    };

    fetchUser();
  }, []);

  return (
    <header className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center sticky top-0 z-10 bg-opacity-90 backdrop-blur-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 tracking-tight mt-0.5">
          Welcome back, {user ? user.name : "Chef"}!
        </p>
      </div>
      <div className="flex items-center gap-5">
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium tracking-tight placeholder:text-slate-400 focus:bg-white focus:border-[#c94430] focus:ring-2 focus:ring-[#c94430]/10 outline-none transition-all w-64"
          />
        </div>
        <button className="p-2 relative text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors border border-slate-100">
          <Bell size={18} strokeWidth={2} />
          <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-[#c94430] rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
