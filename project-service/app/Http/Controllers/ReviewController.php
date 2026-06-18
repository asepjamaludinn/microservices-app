<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use Illuminate\Http\Request;
use App\Services\ReviewService;

class ReviewController extends Controller
{
    protected $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    public function index(Request $request)
    {
        $reviews = $this->reviewService->getAllReviews($request->query('per_page', 10));
        return $this->successResponse($reviews, 'Daftar ulasan berhasil diambil.');
    }

    public function store(StoreReviewRequest $request)
    {
        try {
            $authUserId = $request->attributes->get('auth_user_id');
            $review = $this->reviewService->createReview($request->validated(), $authUserId);
            return $this->successResponse($review, 'Terima kasih atas ulasan Anda!', 201);
        } catch (\Exception $e) {
            $code = $e->getCode() ?: 400;
            $code = ($code >= 400 && $code <= 500) ? $code : 400;
            return $this->errorResponse($e->getMessage(), $code);
        }
    }
}