<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Table;
use App\Models\OrderItem;
use App\Models\Review;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsService
{
    public function getDashboardMetrics()
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

        $recentReviews = Review::select('customer_name as customer', 'rating', 'comment', 'created_at')
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

        return [
            'overview' => compact('todayOrders', 'todayRevenue', 'thisMonthRevenue', 'ordersInProgress', 'totalCompleted', 'totalCancelled'),
            'table_utilization' => ['occupied' => $occupiedTables, 'total' => $totalTables, 'percentage' => $tableUtilization],
            'orders_per_day' => $ordersLast7Days,
            'best_selling_menus' => $bestSellingMenus,
            'top_categories' => $topCategories,
            'recent_reviews' => $recentReviews,
        ];
    }
}