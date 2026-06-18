<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Requests\UpdatePaymentStatusRequest;
use App\Services\OrderService;
use App\Services\AnalyticsService;
use App\Http\Resources\OrderResource;

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
        $data = method_exists($orders, 'currentPage') 
            ? OrderResource::collection($orders)->response()->getData(true)
            : OrderResource::collection($orders);
            
        return $this->successResponse($data, 'Data pesanan berhasil diambil.');
    }

    public function store(StoreOrderRequest $request)
    {
        $authUserId = $request->attributes->get('auth_user_id');
        $order = $this->orderService->createOrder($request->validated(), $authUserId);
        
        return $this->successResponse(new OrderResource($order), 'Pesanan berhasil dibuat.', 201);
    }

    public function myOrders(Request $request)
    {
        $authUserId = $request->attributes->get('auth_user_id');
        $perPage = $request->query('per_page', 10);
        $orders = $this->orderService->getUserOrders($authUserId, $perPage);
        
        return $this->successResponse(
            OrderResource::collection($orders)->response()->getData(true), 
            'Data pesanan Anda berhasil diambil.'
        );
    }

    public function updateStatus(UpdateOrderStatusRequest $request, $id)
    {
        $authUserId = $request->attributes->get('auth_user_id');
        $order = $this->orderService->updateOrderStatus($id, $request->status, $authUserId);
        
        return $this->successResponse(new OrderResource($order), 'Status pesanan berhasil diperbarui.');
    }

    public function updatePaymentStatus(UpdatePaymentStatusRequest $request, $id)
    {
        $authUserId = $request->attributes->get('auth_user_id');
        $order = $this->orderService->updatePaymentStatus($id, $request->payment_status, $authUserId);
        
        return $this->successResponse(new OrderResource($order), 'Status pembayaran berhasil diperbarui.');
    }

    public function getAnalytics()
    {
        $metrics = $this->analyticsService->getDashboardMetrics();
        return $this->successResponse($metrics, 'Data analitik berhasil diambil.');
    }
}