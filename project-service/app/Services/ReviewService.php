<?php

namespace App\Services;

use App\Models\Review;
use App\Models\Order;

class ReviewService
{
    public function getAllReviews($perPage = 10)
    {
        return Review::latest()->paginate($perPage);
    }

    public function createReview(array $data, $authUserId)
    {
        $order = Order::find($data['order_id']);

        if (!$order) {
            throw new \Exception('Pesanan tidak ditemukan.', 404);
        }

        if ((string) $order->user_id !== (string) $authUserId) {
            throw new \Exception('Anda tidak diizinkan mengulas pesanan orang lain.', 403);
        }

        if ($order->status !== 'completed') {
            throw new \Exception('Anda hanya dapat mengulas pesanan yang sudah selesai.', 400);
        }

        if (Review::where('order_id', $order->id)->exists()) {
            throw new \Exception('Anda sudah memberikan ulasan untuk pesanan ini.', 400);
        }

        return Review::create($data);
    }
}