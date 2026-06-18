<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Order;
use App\Http\Requests\StoreReviewRequest;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::latest()->paginate(10);
        return $this->successResponse($reviews, 'Daftar ulasan berhasil diambil.');
    }

    public function store(StoreReviewRequest $request)
    {
        $authUserId = $request->attributes->get('auth_user_id');

        $order = Order::find($request->order_id);

        if (!$order) {
            return $this->errorResponse('Pesanan tidak ditemukan.', 404);
        }

        if ((string) $order->user_id !== (string) $authUserId) {
            return $this->errorResponse('Anda tidak diizinkan mengulas pesanan orang lain.', 403);
        }

        if ($order->status !== 'completed') {
            return $this->errorResponse('Anda hanya dapat mengulas pesanan yang sudah selesai.', 400);
        }

        if (Review::where('order_id', $order->id)->exists()) {
            return $this->errorResponse('Anda sudah memberikan ulasan untuk pesanan ini.', 400);
        }

        $reviewData = $request->all();
        $review = Review::create($reviewData);

        return $this->successResponse($review, 'Terima kasih atas ulasan Anda!', 201);
    }
}