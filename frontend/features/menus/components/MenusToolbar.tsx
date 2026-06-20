import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MenusToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
}

export default function MenusToolbar({
  searchQuery,
  setSearchQuery,
  handleKeyDown,
  handleSearch,
}: MenusToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <Input
          type="text"
          placeholder="Cari nama menu (Tekan Enter)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl border-slate-200 bg-slate-50 py-5 pl-10 pr-4 text-sm focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430]"
        />
      </div>
      <Button
        onClick={handleSearch}
        className="rounded-xl bg-[#c94430] px-6 py-5 text-sm font-semibold text-white hover:bg-[#b03a28]"
      >
        Search
      </Button>
    </div>
  );
}
