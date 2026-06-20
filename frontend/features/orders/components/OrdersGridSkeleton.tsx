import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2 w-1/3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex flex-col items-end gap-2 w-1/3">
              <Skeleton className="h-6 w-full rounded-full" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>
          </div>
          <div className="mb-6 border-t border-slate-50 pt-4 space-y-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="space-y-3 mb-5">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex justify-between gap-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100 mt-auto space-y-4">
            <div className="flex justify-between items-end">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-1/3" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 flex-1 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
