<?php

namespace App\Repositories;

use App\Models\Order;
use App\Models\Table;
use App\Models\OrderItem;
use App\Models\Review;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsRepository
{
    public function getTodayOrderCount($today) { return Order::whereDate('created_at', $today)->count(); }
    public function getTodayRevenue($today) { return Order::whereDate('created_at', $today)->where('payment_status', 'paid')->sum('total_amount'); }
    public function getThisMonthRevenue($startOfMonth) { return Order::where('created_at', '>=', $startOfMonth)->where('payment_status', 'paid')->sum('total_amount'); }
    public function getOrdersInProgressCount() { return Order::whereIn('status', ['pending', 'cooking'])->count(); }
    public function getCountByStatus($status) { return Order::where('status', $status)->count(); }
    public function getTotalTables() { return Table::count(); }
    public function getOccupiedTablesCount() { return Table::where('status', 'in_use')->count(); }

    public function getOrdersLast7Days()
    {
        return Order::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->where('created_at', '>=', Carbon::now()->subDays(6)->startOfDay())
            ->groupBy('date')->orderBy('date', 'ASC')->get();
    }

    public function getBestSellingMenus()
    {
        return OrderItem::select('menu_id', DB::raw('SUM(quantity) as total_sold'))
            ->with('menu:id,name')
            ->whereHas('order', function ($query) { $query->where('status', 'completed'); })
            ->groupBy('menu_id')->orderByDesc('total_sold')->take(5)->get();
    }

    public function getTopCategories()
    {
        return DB::table('order_items')
            ->join('menus', 'order_items.menu_id', '=', 'menus.id')
            ->join('categories', 'menus.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->select('categories.name', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->where('orders.status', 'completed')
            ->groupBy('categories.name')->orderByDesc('total_sold')->take(4)->get();
    }

    public function getRecentReviews()
    {
        return Review::select('customer_name as customer', 'rating', 'comment', 'created_at')
            ->latest()->take(3)->get();
    }
}