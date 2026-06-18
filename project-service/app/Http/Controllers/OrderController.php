<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Requests\UpdatePaymentStatusRequest;
use App\Services\OrderService;
use App\Services\AnalyticsService;

class OrderController extends Controller
{
    protected $orderService;
    protected $analyticsService;

    public function __construct(OrderService $orderService, AnalyticsService $analyticsService)
    {
        $this->orderService = $orderService;
        $this->analyticsService = $analyticsService;
    }

    public function index(Request $request)
    {
        $orders = $this->orderService->getAllOrders($request->all());
        $message = $request->query('paginate') === 'false' ? 'Semua data pesanan berhasil diambil.' : 'Data pesanan (paginated) berhasil diambil.';
        return $this->successResponse($orders, $message);
    }

    public function myOrders(Request $request)
    {
        $authUserId = $request->attributes->get('auth_user_id');
        $orders = $this->orderService->getUserOrders($authUserId, $request->query('per_page', 10));
        return $this->successResponse($orders, 'Riwayat pesanan Anda berhasil diambil.');
    }

    public function store(StoreOrderRequest $request)
    {
        try {
            $authUserId = $request->attributes->get('auth_user_id');
            $order = $this->orderService->createOrder($request->validated(), $authUserId);
            return $this->successResponse($order, 'Transaksi berhasil dibuat.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function updateStatus(UpdateOrderStatusRequest $request, $id)
    {
        try {
            $authUserId = $request->attributes->get('auth_user_id');
            $order = $this->orderService->updateOrderStatus($id, $request->status, $authUserId);
            return $this->successResponse($order, "Status pesanan berhasil diubah menjadi {$request->status}.");
        } catch (\Exception $e) {
            return $this->errorResponse("Gagal merubah status: " . $e->getMessage(), 500);
        }
    }

    public function updatePaymentStatus(UpdatePaymentStatusRequest $request, $id)
    {
        try {
            $authUserId = $request->attributes->get('auth_user_id');
            $order = $this->orderService->updatePaymentStatus($id, $request->payment_status, $authUserId);
            return $this->successResponse($order, "Status pembayaran berhasil diubah menjadi {$request->payment_status}.");
        } catch (\Exception $e) {
            return $this->errorResponse("Gagal merubah status pembayaran: " . $e->getMessage(), 500);
        }
    }

    public function getAnalytics()
    {
        $metrics = $this->analyticsService->getDashboardMetrics();
        return $this->successResponse($metrics, 'Data analytics berhasil diambil.');
    }
}