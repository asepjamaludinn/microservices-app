import { Skeleton } from "@/components/ui/skeleton";

export default function POSMenuSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col">
      <Skeleton className="h-28 w-full rounded-none" />
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2 mb-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>
    </div>
  );
}
