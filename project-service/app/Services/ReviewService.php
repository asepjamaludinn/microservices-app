<?php

namespace App\Services;

use App\Repositories\ReviewRepository;
use App\Repositories\OrderRepository;
use Illuminate\Support\Facades\Gate;

class ReviewService
{
    protected $reviewRepo;
    protected $orderRepo;

    public function __construct(ReviewRepository $reviewRepo, OrderRepository $orderRepo)
    {
        $this->reviewRepo = $reviewRepo;
        $this->orderRepo = $orderRepo;
    }

    public function getAllReviews($perPage = 10)
    {
        return $this->reviewRepo->getPaginatedReviews($perPage);
    }

    public function createReview(array $data, $authUserId)
    {
        $order = $this->orderRepo->findById($data['order_id']);

        Gate::authorize('review', $order);

        if ($order->status !== 'completed') {
            throw new \Exception('Anda hanya dapat mengulas pesanan yang sudah selesai.', 400);
        }
        if ($this->reviewRepo->existsForOrder($order->id)) {
            throw new \Exception('Anda sudah memberikan ulasan untuk pesanan ini.', 400);
        }

        return $this->reviewRepo->create($data);
    }
}