<?php

namespace App\Services;

use App\Repositories\ReviewRepository;
use App\Repositories\MenuRepository;


class ReviewService
{
    protected $reviewRepo;
    protected $menuRepo;

    public function __construct(ReviewRepository $reviewRepo, MenuRepository $menuRepo)
    {
        $this->reviewRepo = $reviewRepo;
        $this->menuRepo = $menuRepo;
    }

    public function getAllReviews($perPage = 10, $search = null)
    {
        return $this->reviewRepo->getPaginatedReviews($perPage, $search);
    }

    public function createReview(array $data, $authUserId)
    {
        $menu = $this->menuRepo->findById($data['menu_id']);

        $customerName = auth()->user()->name ?? 'Guest'; 
        
        if ($this->reviewRepo->existsForMenuAndCustomer($menu->id, $customerName)) {
            throw new \Exception('Anda sudah memberikan ulasan untuk menu ini.', 400);
        }

       $data['customer_name'] = $customerName;
        $review = $this->reviewRepo->create($data);

        $avgRating = $menu->reviews()->avg('rating');
        $this->menuRepo->update($menu, ['rating' => round($avgRating, 1)]);

        return $review->load('menu.category');
    }
}