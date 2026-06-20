<?php

namespace App\Services;

use App\Repositories\PaymentRepository;
use App\Repositories\OrderRepository;
use App\Repositories\AuditLogRepository;
use App\Services\OrderService; 
use Illuminate\Support\Facades\DB;

class PaymentService
{
    protected $paymentRepo;
    protected $orderRepo;
    protected $auditLogRepo;
    protected $orderService; 

    public function __construct(
        PaymentRepository $paymentRepo, 
        OrderRepository $orderRepo, 
        AuditLogRepository $auditLogRepo,
        OrderService $orderService 
    ) {
        $this->paymentRepo = $paymentRepo;
        $this->orderRepo = $orderRepo;
        $this->auditLogRepo = $auditLogRepo;
        $this->orderService = $orderService;
    }

    public function processPayment($orderId, $amountPaid, $authUserId)
    {
        return DB::transaction(function () use ($orderId, $amountPaid, $authUserId) {
            $order = $this->orderRepo->findById($orderId, ['table']);

            if ($order->status === 'cancelled') {
                throw new \Exception("Pesanan yang sudah dibatalkan tidak dapat dibayar.");
            }

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
                'status' => $order->status === 'pending' ? 'ready' : $order->status 
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

    public function getAllPayments($search = null) { 
        return $this->paymentRepo->getAllPaginated(15, $search); 
    }
    
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
            $order = $this->orderRepo->findById($payment->order_id);

            if ($order->payment_status === 'refunded') {
                throw new \Exception("Pembayaran ini sudah di-refund sebelumnya.");
            }

            $this->orderService->updateOrderStatus($order->id, 'cancelled', $authUserId);

            return $payment;
        });
    }
}