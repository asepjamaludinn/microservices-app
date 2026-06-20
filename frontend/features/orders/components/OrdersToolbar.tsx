import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ORDER_TABS, type OrderTab } from "@/utils/order-formatters";

interface OrdersToolbarProps {
  activeTab: OrderTab;
  setActiveTab: (tab: OrderTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function OrdersToolbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}: OrdersToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex bg-white p-1.5 rounded-full shadow-sm border border-slate-100 w-max">
        {ORDER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab
                ? "bg-[#c94430] text-white shadow-md"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <Input
          placeholder="Cari pelanggan / ID otomatis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 rounded-xl bg-white border-slate-200 focus-visible:ring-[#c94430]/20 min-w-[280px]"
        />
      </div>
    </div>
  );
}
