import * as z from "zod";

export const orderSchema = z
  .object({
    customerName: z.string().min(2, { message: "Nama minimal 2 karakter" }),

    orderType: z.enum(["dine_in", "takeaway"]),

    tableNumber: z.string().optional(),

    paymentMethod: z.enum(["cash", "qris", "card"]),
  })
  .superRefine((data, ctx) => {
    if (data.orderType === "dine_in" && !data.tableNumber) {
      ctx.addIssue({
        code: "custom",
        path: ["tableNumber"],
        message: "Nomor meja wajib diisi untuk dine in",
      });
    }
  });

export type OrderFormValues = z.infer<typeof orderSchema>;
