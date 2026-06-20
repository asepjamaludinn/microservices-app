import type { Order, OrderStatus } from "@/types/order";
import OrderCard from "./OrderCard";

interface OrdersGridProps {
  orders: Order[];
  isProcessingAction: boolean;
  onOpenDetail: (order: Order) => void;
  onPayBill: (order: Order) => void;
  onChangeStatus: (orderId: number, status: OrderStatus) => void;
  onPrint: (order: Order) => void;
}

export default function OrdersGrid({
  orders,
  isProcessingAction,
  onOpenDetail,
  onPayBill,
  onChangeStatus,
  onPrint,
}: OrdersGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          isProcessingAction={isProcessingAction}
          onOpenDetail={onOpenDetail}
          onPayBill={onPayBill}
          onChangeStatus={onChangeStatus}
          onPrint={onPrint}
        />
      ))}
    </div>
  );
}
