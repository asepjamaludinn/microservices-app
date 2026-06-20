<?php

namespace App\Repositories;

use App\Models\Payment;

class PaymentRepository
{
    public function create(array $data)
    {
        return Payment::create($data);
    }

    public function generateReceiptNumber()
    {
        $prefix = 'RCP-' . now()->format('Ymd') . '-';
        $lastPayment = Payment::where('receipt_number', 'like', $prefix . '%')->orderBy('id', 'desc')->first();
        
        $number = $lastPayment ? intval(substr($lastPayment->receipt_number, -4)) + 1 : 1;
        return $prefix . str_pad($number, 4, '0', STR_PAD_LEFT);
    }

    public function getAllPaginated($perPage = 15, $search = null)
    {
        $query = Payment::with('order')->orderBy('paid_at', 'desc');

        if ($search) {
            $query->where('receipt_number', 'like', '%' . $search . '%')
                  ->orWhereHas('order', function ($q) use ($search) {
                      $q->where('customer_name', 'like', '%' . $search . '%');
                  });
        }

        return $query->paginate($perPage);
    }

    public function findById($id)
    {
        return Payment::with('order.items.menu')->findOrFail($id);
    }

    public function getByOrderId($orderId)
    {
        return Payment::where('order_id', $orderId)->first();
    }
}