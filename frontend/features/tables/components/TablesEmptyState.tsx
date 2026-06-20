import { Armchair } from "lucide-react";

export default function TablesEmptyState() {
  return (
    <div className="flex h-64 flex-col items-center justify-center text-slate-400">
      <Armchair size={48} className="mb-3 opacity-30" />
      <p className="font-semibold">Tidak ada meja yang cocok.</p>
    </div>
  );
}
