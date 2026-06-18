<?php

namespace App\Services;

use App\Repositories\PaymentRepository;
use App\Repositories\OrderRepository;
use App\Repositories\AuditLogRepository;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    protected $paymentRepo;
    protected $orderRepo;
    protected $auditLogRepo;

    public function __construct(PaymentRepository $paymentRepo, OrderRepository $orderRepo, AuditLogRepository $auditLogRepo)
    {
        $this->paymentRepo = $paymentRepo;
        $this->orderRepo = $orderRepo;
        $this->auditLogRepo = $auditLogRepo;
    }

    public function processPayment($orderId, $amountPaid, $authUserId)
    {
        return DB::transaction(function () use ($orderId, $amountPaid, $authUserId) {
            $order = $this->orderRepo->findById($orderId, ['table']);

            if ($order->payment_status === 'paid') {
                throw new \Exception("Pesanan ini sudah dibayar.");
            }

            if ($amountPaid < $order->total_amount) {
                throw new \Exception("Jumlah bayar kurang dari total tagihan (Total: Rp " . number_format($order->total_amount, 0, ',', '.') . ").");
            }

            $changeAmount = $amountPaid - $order->total_amount;

            $payment = $this->paymentRepo->create([
                'order_id' => $order->id,
                'receipt_number' => $this->paymentRepo->generateReceiptNumber(),
                'amount_paid' => $amountPaid,
                'change_amount' => $changeAmount,
                'paid_at' => now(),
            ]);

            $this->orderRepo->update($order, [
                'payment_status' => 'paid',
                'status' => $order->status === 'pending' ? 'ready' : $order->status // Auto update status operasional jika diperlukan
            ]);

            $this->auditLogRepo->create([
                'user_id' => $authUserId,
                'action' => 'PAYMENT_PROCESSED',
                'entity_type' => 'Order',
                'entity_id' => $order->id,
                'details' => json_encode([
                    'receipt_number' => $payment->receipt_number,
                    'amount_paid' => $amountPaid,
                    'change' => $changeAmount
                ])
            ]);

            return $payment->load('order');
        });
    }
    public function getAllPayments() { return $this->paymentRepo->getAllPaginated(); }
    
    public function getPaymentById($id) { return $this->paymentRepo->findById($id); }
    
    public function getPaymentByOrder($orderId) { 
        $payment = $this->paymentRepo->getByOrderId($orderId);
        if (!$payment) throw new \Exception("Belum ada pembayaran untuk pesanan ini.", 404);
        return $payment;
    }

    public function refund($paymentId, $authUserId)
    {
        return DB::transaction(function () use ($paymentId, $authUserId) {
            $payment = $this->paymentRepo->findById($paymentId);
            $order = $this->orderRepo->findById($payment->order_id, ['items.menu.recipe.ingredients']);

            if ($order->payment_status === 'refunded') {
                throw new \Exception("Pembayaran ini sudah di-refund sebelumnya.");
            }

            // Kembalikan stok bahan baku (menggunakan logika yang sama saat order cancelled)
            $refundedItems = [];
            foreach ($order->items as $item) {
                if ($recipe = $item->menu->recipe) {
                    foreach ($recipe->ingredients as $ingredient) {
                        $qtyToRefund = $ingredient->pivot->quantity * $item->quantity;
                        $lockedIngredient = app(\App\Repositories\InventoryRepository::class)->findLockedById($ingredient->id);
                        if ($lockedIngredient) {
                            $lockedIngredient->increment('stock', $qtyToRefund);
                            $refundedItems[] = "{$lockedIngredient->name} (+{$qtyToRefund})";
                        }
                    }
                }
            }

            // Update status pembayaran di Order
            $this->orderRepo->update($order, [
                'payment_status' => 'refunded',
                'status' => 'cancelled' // Otomatis batalkan pesanan operasional
            ]);

            // Jika ada meja yang terkait, set kembali menjadi available
            if ($order->table_id) {
                $table = app(\App\Repositories\TableRepository::class)->findLockedById($order->table_id);
                app(\App\Repositories\TableRepository::class)->update($table, ['status' => 'available']);
            }

            $this->auditLogRepo->create([
                'user_id' => $authUserId,
                'action' => 'PAYMENT_REFUNDED',
                'entity_type' => 'Payment',
                'entity_id' => $payment->id,
                'details' => json_encode(['receipt_number' => $payment->receipt_number, 'refunded_stock' => $refundedItems])
            ]);

            return $payment;
        });
    }
}