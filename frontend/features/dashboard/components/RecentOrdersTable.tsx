import Image from "next/image";
import { Search, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardStatusBadge from "./DashboardStatusBadge";
import { formatRupiah } from "../utils/dashboard-formatters";

interface RecentOrdersTableProps {
  recentOrders: any[];
}

export default function RecentOrdersTable({
  recentOrders,
}: RecentOrdersTableProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800">Recent Orders</h3>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Search placeholder"
              className="pl-8 h-9 text-xs rounded-lg bg-slate-50 border-transparent w-48"
            />
          </div>
          <Button
            variant="outline"
            className="h-9 rounded-lg text-xs font-bold border-slate-200 text-slate-600"
          >
            See All Orders
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 font-semibold border-b border-slate-100">
            <tr>
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Photo</th>
              <th className="pb-3 font-medium">Menu</th>
              <th className="pb-3 font-medium">Qty</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recentOrders.map((order) => {
              const firstItem = order.items[0];

              return (
                <tr key={order.id}>
                  <td className="py-4 font-bold text-slate-500">
                    ORD{order.id.toString().padStart(4, "0")}
                  </td>
                  <td className="py-4">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center text-slate-300">
                      {firstItem?.menu?.image_url ? (
                        <Image
                          src={firstItem.menu.image_url}
                          alt={firstItem.menu.name || "menu"}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <Utensils size={16} />
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-slate-800">
                      {firstItem?.menu?.name || "Multiple Items"}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {firstItem?.menu?.category?.name || "Category"}
                    </p>
                  </td>
                  <td className="py-4 font-bold text-slate-600">
                    {order.items.reduce(
                      (sum: number, item: any) => sum + item.quantity,
                      0,
                    )}
                  </td>
                  <td className="py-4 font-bold text-[#ff5722]">
                    {formatRupiah(order.total_amount)}
                  </td>
                  <td className="py-4 font-bold text-slate-600">
                    {order.customer_name}
                  </td>
                  <td className="py-4 text-center">
                    <DashboardStatusBadge status={order.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {recentOrders.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-sm font-medium">
            Belum ada transaksi.
          </div>
        )}
      </div>
    </div>
  );
}
