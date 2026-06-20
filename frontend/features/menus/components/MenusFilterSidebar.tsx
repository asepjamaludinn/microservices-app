import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Category {
  id: number;
  name: string;
}

interface MenusFilterSidebarProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedRating: number | null;
  setSelectedRating: (rating: number | null) => void;
}

export default function MenusFilterSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedRating,
  setSelectedRating,
}: MenusFilterSidebarProps) {
  return (
    <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm h-fit">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Filter</h3>
        <SlidersHorizontal size={18} className="text-slate-400" />
      </div>

      <div className="space-y-6 text-sm">
        <div>
          <h4 className="mb-3 font-semibold text-slate-700">Category</h4>
          <div className="space-y-3 text-slate-500">
            <label className="flex items-center gap-3 cursor-pointer hover:text-slate-800 transition-colors">
              <Checkbox
                checked={selectedCategory === "All"}
                onCheckedChange={() => setSelectedCategory("All")}
                className="data-[state=checked]:bg-[#c94430] data-[state=checked]:border-[#c94430]"
              />
              <span>All Categories</span>
            </label>
            {categories.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <Checkbox
                  checked={selectedCategory === item.name}
                  onCheckedChange={() => setSelectedCategory(item.name)}
                  className="data-[state=checked]:bg-[#c94430] data-[state=checked]:border-[#c94430]"
                />
                <span>{item.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-slate-700">Minimum Rating</h4>
          <div className="space-y-3 text-slate-500">
            {[5, 4, 3, 2, 1].map((rate) => (
              <label
                key={rate}
                className="flex items-center gap-3 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <Checkbox
                  checked={selectedRating === rate}
                  onCheckedChange={(checked) =>
                    setSelectedRating(checked ? rate : null)
                  }
                  className="data-[state=checked]:bg-[#c94430] data-[state=checked]:border-[#c94430]"
                />
                <span className="flex items-center gap-1 text-yellow-400">
                  {"★".repeat(rate)}
                  <span className="text-slate-500 ml-1">{rate} & up</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
