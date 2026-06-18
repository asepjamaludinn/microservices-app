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
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        return [
            'overview' => [
                'todayOrders' => $this->analyticsRepo->getTodayOrderCount($today),
                'todayRevenue' => $this->analyticsRepo->getTodayRevenue($today),
                'thisMonthRevenue' => $this->analyticsRepo->getThisMonthRevenue($startOfMonth),
                'ordersInProgress' => $this->analyticsRepo->getOrdersInProgressCount(),
                'totalCompleted' => $this->analyticsRepo->getCountByStatus('completed'),
                'totalCancelled' => $this->analyticsRepo->getCountByStatus('cancelled'),
            ],
            'table_utilization' => [
                'occupied' => $this->analyticsRepo->getOccupiedTablesCount(),
                'total' => $this->analyticsRepo->getTotalTables(),
            ],
            'orders_per_day' => $this->analyticsRepo->getOrdersLast7Days(),
            'best_selling_menus' => $this->analyticsRepo->getBestSellingMenus(),
            'top_categories' => $this->analyticsRepo->getTopCategories(),
            'recent_reviews' => $this->analyticsRepo->getRecentReviews()->map(function($r) {
                return ['customer' => $r->customer, 'rating' => (int)$r->rating, 'comment' => $r->comment, 'date' => $r->created_at->toDateString()];
            }),
        ];
    }
}