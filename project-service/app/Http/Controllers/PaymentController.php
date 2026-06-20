<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Services\PaymentService;
use App\Http\Requests\ProcessPaymentRequest;
use App\Http\Resources\PaymentResource;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $payments = $this->paymentService->getAllPayments($search);
        return $this->successResponse(PaymentResource::collection($payments)->response()->getData(true), 'Data riwayat pembayaran berhasil diambil.');
    }

    public function store(ProcessPaymentRequest $request, $orderId)
    {
        $authUserId = $request->attributes->get('auth_user_id');
        
        $payment = $this->paymentService->processPayment(
            $orderId, 
            $request->amount_paid, 
            $authUserId
        );

        return $this->successResponse(new PaymentResource($payment), 'Pembayaran berhasil diproses, struk telah diterbitkan.', 201);
    }

    public function refund(Request $request, $id)
    {
        $authUserId = $request->attributes->get('auth_user_id');
        $payment = $this->paymentService->refund($id, $authUserId);
        
        return $this->successResponse(new PaymentResource($payment), 'Proses refund berhasil. Dana dicatat kembali dan stok di-restock.');
    }
}