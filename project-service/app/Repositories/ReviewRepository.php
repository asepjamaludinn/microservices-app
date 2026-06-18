<?php

namespace App\Repositories;

use App\Models\Review;

class ReviewRepository
{
    public function getPaginatedReviews($perPage = 10)
    {
        return Review::latest()->paginate($perPage);
    }

    public function getRecentReviews($limit = 3)
    {
        return Review::select('customer_name as customer', 'rating', 'comment', 'created_at')
            ->latest()
            ->take($limit)
            ->get();
    }

    public function findById($id)
    {
        return Review::findOrFail($id);
    }

    public function existsForOrder($orderId)
    {
        return Review::where('order_id', $orderId)->exists();
    }

    public function create(array $data)
    {
        return Review::create($data);
    }

    public function delete(Review $review)
    {
        return $review->delete();
    }
}