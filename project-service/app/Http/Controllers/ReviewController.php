<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use Illuminate\Http\Request;
use App\Services\ReviewService;
use App\Http\Resources\ReviewResource;

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
        return $this->successResponse(ReviewResource::collection($reviews)->response()->getData(true), 'Daftar ulasan berhasil diambil.');
    }

    public function store(StoreReviewRequest $request)
    {
        $authUserId = $request->attributes->get('auth_user_id');
        $review = $this->reviewService->createReview($request->validated(), $authUserId);
        return $this->successResponse(new ReviewResource($review), 'Terima kasih atas ulasan Anda!', 201);
    }
}