import { ShoppingCart, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import POSOrderTypeToggle from "./POSOrderTypeToggle";
import POSTableSelect from "./POSTableSelect";
import POSCartList from "./POSCartList";
import POSOrderSummary from "./POSOrderSummary";
import POSPaymentMethod from "./POSPaymentMethod";

import { calculateTax, calculateTotal } from "../utils/pos-utils";

interface POSCheckoutPanelProps {
  form: any;
  onSubmit: (data: any) => void;
  cartStore: any;
  tables: any[];
  isSubmitting: boolean;
}

export default function POSCheckoutPanel({
  form,
  onSubmit,
  cartStore,
  tables,
  isSubmitting,
}: POSCheckoutPanelProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const orderType = watch("orderType");
  const tableNumber = watch("tableNumber");
  const paymentMethod = watch("paymentMethod");

  const subtotal = cartStore.getSubtotal();
  const taxAmount = calculateTax(subtotal);
  const totalAmount = calculateTotal(subtotal, taxAmount);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full lg:w-[400px] xl:w-[450px] bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col flex-shrink-0"
    >
      <div className="p-5 border-b border-slate-100 bg-[#c94430] text-white rounded-t-3xl flex items-center justify-between">
        <h2 className="font-bold flex items-center gap-2 text-lg">
          <ShoppingCart size={20} /> Order Saat Ini
        </h2>
        <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-semibold">
          {cartStore.cart.length} Item
        </span>
      </div>

      <div className="p-5 border-b border-slate-100 space-y-4 bg-slate-50/50">
        <POSOrderTypeToggle
          orderType={orderType}
          onChangeOrderType={(type) => {
            setValue("orderType", type);
            if (type === "takeaway") setValue("tableNumber", "");
          }}
        />

        <div>
          <div className="flex items-center gap-2">
            <User size={18} className="text-slate-400 shrink-0" />
            <Input
              {...register("customerName")}
              placeholder="Nama Pelanggan *"
              className={`border-slate-200 h-10 text-sm rounded-xl focus-visible:ring-[#c94430]/20 focus-visible:border-[#c94430] ${
                errors.customerName
                  ? "border-red-500 focus-visible:ring-red-200"
                  : ""
              }`}
            />
          </div>
          {errors.customerName && (
            <p className="text-xs font-medium text-red-500 mt-1.5 ml-7">
              {errors.customerName.message}
            </p>
          )}
        </div>

        {orderType === "dine_in" && (
          <POSTableSelect
            tables={tables}
            tableNumber={tableNumber}
            setTableNumber={(val) =>
              setValue("tableNumber", val, { shouldValidate: true })
            }
            registerTableNumber={register("tableNumber")}
            error={errors.tableNumber?.message}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        <POSCartList
          cart={cartStore.cart}
          updateQuantity={cartStore.updateQuantity}
          updateNotes={cartStore.updateNotes}
        />
      </div>

      <div className="p-5 border-t border-slate-100 bg-slate-50/80 rounded-b-3xl">
        <POSOrderSummary
          subtotal={subtotal}
          taxAmount={taxAmount}
          totalAmount={totalAmount}
        />
        <POSPaymentMethod
          paymentMethod={paymentMethod}
          setPaymentMethod={(method) => setValue("paymentMethod", method)}
        />
        <Button
          type="submit"
          disabled={cartStore.cart.length === 0 || isSubmitting}
          className="w-full bg-[#c94430] hover:bg-[#b03a28] text-white h-14 rounded-xl font-bold text-base shadow-lg shadow-[#c94430]/20 transition-all disabled:shadow-none"
        >
          {isSubmitting ? "Memproses..." : "Proses Pesanan"}
        </Button>
      </div>
    </form>
  );
}
