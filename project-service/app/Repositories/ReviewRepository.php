<?php

namespace App\Repositories;

use App\Models\Review;

class ReviewRepository
{
  public function getPaginatedReviews($perPage = 10, $search = null)
    {

        $query = Review::with('menu.category')->latest();

        if ($search) {
            $query->where('customer_name', 'like', '%' . $search . '%')
                  ->orWhere('comment', 'like', '%' . $search . '%')
                  ->orWhereHas('menu', function($q) use ($search) {
                      $q->where('name', 'like', '%' . $search . '%');
                  });
        }

        return $query->paginate($perPage);
    }

    public function findById($id)
    {
        return Review::findOrFail($id);
    }

   public function existsForMenuAndCustomer($menuId, $customerName)
    {
        return Review::where('menu_id', $menuId)
                     ->where('customer_name', $customerName)
                     ->exists();
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