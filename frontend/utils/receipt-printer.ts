import type { Order } from "@/types/order";
import {
  formatCurrency,
  formatDate,
  formatOrderNumber,
  formatTime,
} from "@/utils/order-formatters";

export function printReceipt(order: Order) {
  const receiptContent = `
    <html>
      <head>
        <title>Receipt ${formatOrderNumber(order.id)}</title>
        <style>
          body {
            font-family: monospace;
            padding: 20px;
            max-width: 300px;
            margin: 0 auto;
          }

          .header {
            text-align: center;
            margin-bottom: 20px;
          }

          .divider {
            border-top: 1px dashed #000;
            margin: 10px 0;
          }

          .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }

          .item-name {
            flex: 1;
          }

          .item-qty {
            margin: 0 10px;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
          }

          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
          }
        </style>
      </head>

      <body>
        <div class="header">
          <h2>BiteBox Restaurant</h2>
          <p>Order ${formatOrderNumber(order.id)}</p>
          <p>${formatDate(order.created_at)} ${formatTime(order.created_at)}</p>
          <p>Customer: ${order.customer_name}</p>
          <p>
            Type: ${order.order_type.replace("_", " ").toUpperCase()}
            ${order.table_number ? `- Table ${order.table_number}` : ""}
          </p>
        </div>

        <div class="divider"></div>

        <div>
          ${order.items
            .map(
              (item) => `
                <div class="item">
                  <span class="item-name">${item.menu.name}</span>
                  <span class="item-qty">x${item.quantity}</span>
                  <span>${formatCurrency(item.subtotal)}</span>
                </div>
              `,
            )
            .join("")}
        </div>

        <div class="divider"></div>

        <div>
          <div class="item">
            <span>Subtotal:</span>
            <span>${formatCurrency(order.subtotal)}</span>
          </div>

          <div class="item">
            <span>Tax (11%):</span>
            <span>${formatCurrency(order.tax_amount)}</span>
          </div>

          <div class="divider"></div>

          <div class="total-row">
            <span>TOTAL:</span>
            <span>${formatCurrency(order.total_amount)}</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="footer">
          <p>Paid via ${order.payment_method.toUpperCase()}</p>
          <p>Status: ${order.payment_status.toUpperCase()}</p>
          <br />
          <p>Thank you for dining with us!</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    throw new Error("Popup print diblokir browser.");
  }

  printWindow.document.write(receiptContent);
  printWindow.document.close();
}
