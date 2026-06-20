<?php

namespace App\Services;

use App\Repositories\AnalyticsRepository;
use Carbon\Carbon;

class AnalyticsService
{
    protected $analyticsRepo;

    public function __construct(AnalyticsRepository $analyticsRepo)
    {
        $this->analyticsRepo = $analyticsRepo;
    }

    public function getDashboardMetrics()
    {
        $revenueData = $this->analyticsRepo->getRevenueLast7Days()->map(function($item) {
            return [
                'name' => Carbon::parse($item->date)->format('M d'),
                'income' => (float) $item->income,
                'expense' => 0 
            ];
        });

        $ordersWeekData = $this->analyticsRepo->getOrdersLast7Days()->map(function($item) {
            return [
                'name' => Carbon::parse($item->date)->format('D'),
                'orders' => (int) $item->count
            ];
        });

        $categoryData = $this->analyticsRepo->getTopCategories()->map(function($item) {
            return [
                'name' => $item->name,
                'value' => (int) $item->total_sold
            ];
        });

        $orderTypes = $this->analyticsRepo->getOrderTypesCount();
        $totalOrders = array_sum($orderTypes);

        $orderTypesData = [
            'dine_in' => [
                'total' => $orderTypes['dine_in'] ?? 0,
                'percentage' => $totalOrders > 0 ? round((($orderTypes['dine_in'] ?? 0) / $totalOrders) * 100) : 0
            ],
            'takeaway' => [
                'total' => $orderTypes['takeaway'] ?? 0,
                'percentage' => $totalOrders > 0 ? round((($orderTypes['takeaway'] ?? 0) / $totalOrders) * 100) : 0
            ],
            'online' => [
                'total' => $orderTypes['online'] ?? 0,
                'percentage' => $totalOrders > 0 ? round((($orderTypes['online'] ?? 0) / $totalOrders) * 100) : 0
            ]
        ];

        return [
            'today_orders' => $this->analyticsRepo->getTotalOrderCount(),
            'today_revenue' => $this->analyticsRepo->getTotalRevenue(),
            'total_customers' => $this->analyticsRepo->getTotalCustomers(), 
            'orders_in_progress' => $this->analyticsRepo->getOrdersInProgressCount(),
            'table_utilization' => [
                'occupied' => $this->analyticsRepo->getOccupiedTablesCount(),
                'total' => $this->analyticsRepo->getTotalTables(),
                'percentage' => $this->analyticsRepo->getTotalTables() > 0 ? 
                    round(($this->analyticsRepo->getOccupiedTablesCount() / $this->analyticsRepo->getTotalTables()) * 100) : 0
            ],
            'revenue_chart' => $revenueData,
            'category_chart' => $categoryData,
            'orders_week_chart' => $ordersWeekData,
            'order_types' => $orderTypesData,
            'recent_reviews' => $this->analyticsRepo->getRecentReviews()->map(function($r) {
                return [
                    'customer' => $r->customer, 
                    'rating' => (int)$r->rating, 
                    'comment' => $r->comment, 
                    'date' => $r->created_at->toDateString()
                ];
            }),
        ];
    }
}