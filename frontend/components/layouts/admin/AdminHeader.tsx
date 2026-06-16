"use client";

import { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminHeader() {
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
        <div className="relative w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <Input
            type="text"
            placeholder="Search anything..."
            className="pl-9 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary"
          />
        </div>
        <button className="p-2 relative text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors border border-slate-100">
          <Bell size={18} strokeWidth={2} />
          <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
