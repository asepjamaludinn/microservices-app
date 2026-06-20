import { Skeleton } from "@/components/ui/skeleton";

export default function InventoryTableSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-20 ml-auto" />
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-6 py-2">
            <div className="flex items-center gap-3 w-1/4">
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-md w-1/6" />
            <div className="w-1/3 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <div className="flex gap-2 ml-auto">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
