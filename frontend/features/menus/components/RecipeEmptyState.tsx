import { ChefHat, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecipeEmptyStateProps {
  onStartCreate: () => void;
}

export default function RecipeEmptyState({
  onStartCreate,
}: RecipeEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
      <ChefHat size={48} className="mb-4 opacity-50" />
      <p className="font-medium text-slate-600">
        Belum ada resep internal untuk menu ini.
      </p>
      <Button
        onClick={onStartCreate}
        className="mt-4 bg-[#c94430] hover:bg-[#b03a28] text-white rounded-xl"
      >
        <Plus size={16} className="mr-2" /> Buat Resep Baru
      </Button>
    </div>
  );
}
