<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Order;
use App\Models\AuditLog;
use App\Models\Table; 
use App\Models\OrderItem;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Requests\UpdatePaymentStatusRequest;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['items.menu', 'table'])->orderBy('created_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->query('paginate') === 'false') {
            return $this->successResponse($query->get(), 'Semua data pesanan berhasil diambil.');
        }

        $perPage = $request->query('per_page', 15);
        $orders = $query->paginate($perPage);

        return $this->successResponse($orders, 'Data pesanan (paginated) berhasil diambil.');
    }

    public function myOrders(Request $request)
    {
        $authUserId = $request->attributes->get('auth_user_id');

        $perPage = $request->query('per_page', 10);
        $orders = Order::with(['items.menu', 'table'])
            ->where('user_id', $authUserId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $this->successResponse($orders, 'Riwayat pesanan Anda berhasil diambil.');
    }

    public function store(StoreOrderRequest $request)
    {
        try {
            DB::beginTransaction();

            $subtotal = 0;
            $orderItemsData = [];
            $deductedItems = []; 
            $authUserId = $request->attributes->get('auth_user_id');
            
            $tableId = $request->order_type === 'takeaway' ? null : $request->table_id;
            
            if ($tableId) {
                $table = Table::lockForUpdate()->findOrFail($tableId);
                
                if (in_array($table->status, ['in_use', 'reserved', 'maintenance'])) {
                    throw new \Exception("Meja {$table->table_number} sedang tidak tersedia ({$table->status}).");
                }
                
                $table->status = 'in_use';
                $table->save();
            }

            foreach ($request->items as $item) {
                $menu = Menu::with('recipe.ingredients')->findOrFail($item['menu_id']);
                
                if (!$menu->is_available) {
                    throw new \Exception("Menu {$menu->name} sedang tidak tersedia.");
                }

                if ($menu->recipe) {
                    foreach ($menu->recipe->ingredients as $ingredient) {
                        $qtyToDeduct = $ingredient->pivot->quantity * $item['quantity'];
                        
                        $lockedIngredient = Ingredient::lockForUpdate()->find($ingredient->id);
                        
                        if (!$lockedIngredient || $lockedIngredient->stock < $qtyToDeduct) {
                            $itemName = $lockedIngredient ? $lockedIngredient->name : 'Bahan Tidak Diketahui';
                            throw new \Exception("Pesanan ditolak. Stok {$itemName} tidak mencukupi untuk membuat {$menu->name}.");
                        }

                        $lockedIngredient->decrement('stock', $qtyToDeduct);
                        $deductedItems[] = "{$lockedIngredient->name} (-{$qtyToDeduct})";
                    }
                }

                $itemSubtotal = $menu->price * $item['quantity'];
                $subtotal += $itemSubtotal;

                $orderItemsData[] = [
                    'menu_id' => $menu->id,
                    'quantity' => $item['quantity'],
                    'price' => $menu->price, 
                    'subtotal' => $itemSubtotal,
                    'notes' => $item['notes'] ?? null,
                ];
            }

            $taxAmount = $subtotal * 0.11;
            $totalAmount = $subtotal + $taxAmount;

            $order = Order::create([
                'user_id' => $authUserId,
                'customer_name' => $request->customer_name,
                'order_type' => $request->order_type, 
                'table_id' => $tableId, 
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'payment_method' => $request->payment_method,
                'status' => 'pending', 
                'payment_status' => 'unpaid' 
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            AuditLog::create([
                'user_id' => $authUserId,
                'action' => 'ORDER_CREATED',
                'entity_type' => 'Order',
                'entity_id' => $order->id,
                'details' => json_encode(['total_amount' => $totalAmount, 'table_id' => $tableId])
            ]);

            if (count($deductedItems) > 0) {
                AuditLog::create([
                    'user_id' => $authUserId,
                    'action' => 'STOCK_DEDUCTED',
                    'entity_type' => 'Order',
                    'entity_id' => $order->id,
                    'details' => json_encode(['reason' => 'Order Placed', 'deducted' => $deductedItems])
                ]);
            }

            DB::commit();

            return $this->successResponse($order->load(['items.menu', 'table']), 'Transaksi berhasil dibuat.', 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function updateStatus(UpdateOrderStatusRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $order = Order::with(['items.menu.recipe.ingredients', 'table'])->findOrFail($id);
            $authUserId = $request->attributes->get('auth_user_id');
            $oldStatus = $order->status;
            
            if (in_array($request->status, ['completed', 'cancelled'])) {
                if ($order->table_id && $order->table) {
                    $order->table->status = 'available';
                    $order->table->save();
                }
            }

            if ($request->status === 'cancelled' && $oldStatus !== 'cancelled') {
                $refundedItems = [];
                foreach ($order->items as $item) {
                    $recipe = $item->menu->recipe;
                    if ($recipe) {
                        foreach ($recipe->ingredients as $ingredient) {
                            $qtyToRefund = $ingredient->pivot->quantity * $item->quantity;
                            
                            $lockedIngredient = Ingredient::lockForUpdate()->find($ingredient->id);
                            if ($lockedIngredient) {
                                $lockedIngredient->increment('stock', $qtyToRefund);
                                $refundedItems[] = "{$lockedIngredient->name} (+{$qtyToRefund})";
                            }
                        }
                    }
                }

                if ($order->payment_status === 'paid') {
                    $order->payment_status = 'refunded';
                }

                if (count($refundedItems) > 0) {
                    AuditLog::create([
                        'user_id' => $authUserId,
                        'action' => 'STOCK_REFUNDED',
                        'entity_type' => 'Order',
                        'entity_id' => $order->id,
                        'details' => json_encode(['reason' => 'Order Cancelled', 'refunded' => $refundedItems])
                    ]);
                }
            }

            $order->status = $request->status;
            $order->save();

            AuditLog::create([
                'user_id' => $authUserId,
                'action' => 'ORDER_STATUS_UPDATED',
                'entity_type' => 'Order',
                'entity_id' => $order->id,
                'details' => json_encode(['from' => $oldStatus, 'to' => $request->status])
            ]);

            DB::commit();

            return $this->successResponse($order, "Status pesanan berhasil diubah menjadi {$request->status}.");
            
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse("Gagal merubah status: " . $e->getMessage(), 500);
        }
    }

    public function updatePaymentStatus(UpdatePaymentStatusRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $order = Order::findOrFail($id);
            $authUserId = $request->attributes->get('auth_user_id');

            $oldPaymentStatus = $order->payment_status;
            $newPaymentStatus = $request->payment_status;

            if ($oldPaymentStatus === 'refunded') {
                throw new \Exception("Pesanan yang sudah di-refund tidak dapat diubah kembali.");
            }

            if ($oldPaymentStatus === 'paid' && $newPaymentStatus === 'unpaid') {
                throw new \Exception("Pesanan yang sudah dibayar tidak dapat dikembalikan menjadi belum dibayar.");
            }

            $order->payment_status = $newPaymentStatus;
            $order->save();

            AuditLog::create([
                'user_id' => $authUserId,
                'action' => 'PAYMENT_STATUS_UPDATED',
                'entity_type' => 'Order',
                'entity_id' => $order->id,
                'details' => json_encode(['from' => $oldPaymentStatus, 'to' => $newPaymentStatus])
            ]);

            DB::commit();

            return $this->successResponse($order, "Status pembayaran berhasil diubah menjadi {$newPaymentStatus}.");
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse("Gagal merubah status pembayaran: " . $e->getMessage(), 500);
        }
    }

    public function getAnalytics()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        $todayOrders = Order::whereDate('created_at', $today)->count();
        $todayRevenue = Order::whereDate('created_at', $today)->where('payment_status', 'paid')->sum('total_amount');
        
        $thisMonthRevenue = Order::where('created_at', '>=', $startOfMonth)
                                 ->where('payment_status', 'paid')
                                 ->sum('total_amount');

        $ordersInProgress = Order::whereIn('status', ['pending', 'cooking'])->count();

        $totalCompleted = Order::where('status', 'completed')->count();
        $totalCancelled = Order::where('status', 'cancelled')->count();

        $totalTables = Table::count();
        $occupiedTables = Table::where('status', 'in_use')->count();
        $tableUtilization = $totalTables > 0 ? round(($occupiedTables / $totalTables) * 100) : 0;

        $ordersLast7Days = Order::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->where('created_at', '>=', Carbon::now()->subDays(6)->startOfDay())
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        $bestSellingMenus = OrderItem::select('menu_id', DB::raw('SUM(quantity) as total_sold'))
            ->with('menu:id,name')
            ->whereHas('order', function ($query) {
                $query->where('status', 'completed');
            })
            ->groupBy('menu_id')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        $topCategories = DB::table('order_items')
            ->join('menus', 'order_items.menu_id', '=', 'menus.id')
            ->join('categories', 'menus.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->select('categories.name', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->where('orders.status', 'completed')
            ->groupBy('categories.name')
            ->orderByDesc('total_sold')
            ->take(4)
            ->get();

        $recentReviews = \App\Models\Review::select('customer_name as customer', 'rating', 'comment', 'created_at')
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($review) {
                return [
                    'customer' => $review->customer,
                    'rating' => (int) $review->rating,
                    'comment' => $review->comment,
                    'date' => $review->created_at->toDateString()
                ];
            });

        return $this->successResponse([
            'overview' => [
                'today_orders' => $todayOrders,
                'today_revenue' => $todayRevenue,
                'this_month_revenue' => $thisMonthRevenue,
                'orders_in_progress' => $ordersInProgress,
                'total_completed' => $totalCompleted,
                'total_cancelled' => $totalCancelled,
            ],
            'table_utilization' => [
                'occupied' => $occupiedTables,
                'total' => $totalTables,
                'percentage' => $tableUtilization
            ],
            'orders_per_day' => $ordersLast7Days,
            'best_selling_menus' => $bestSellingMenus,
            'top_categories' => $topCategories,
            'recent_reviews' => $recentReviews,
        ], 'Data analytics berhasil diambil.');
    }
}