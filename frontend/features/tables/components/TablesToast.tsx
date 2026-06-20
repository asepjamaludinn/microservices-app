import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TablesToastProps {
  toast: { show: boolean; message: string; type: "success" | "error" };
}

export default function TablesToast({ toast }: TablesToastProps) {
  if (!toast.show) return null;

  return (
    <div
      className={cn(
        "fixed top-6 right-6 z-[100] animate-in slide-in-from-top-4 fade-in duration-300 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-white",
        toast.type === "success" ? "bg-emerald-500" : "bg-red-500",
      )}
    >
      {toast.type === "success" ? (
        <CheckCircle2 size={20} />
      ) : (
        <AlertCircle size={20} />
      )}
      {toast.message}
    </div>
  );
}
