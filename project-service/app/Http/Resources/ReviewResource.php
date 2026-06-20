<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name,
            'rating' => (int) $this->rating,
            'comment' => $this->comment,
           'menu' => $this->menu ? [
                'id' => $this->menu->id,
                'name' => $this->menu->name,
                'image_url' => $this->menu->image_url,
                'category_name' => $this->menu->category->name ?? 'Uncategorized',
                'overall_rating' => (float) $this->menu->rating,
                'total_reviews' => $this->menu->reviews()->count()
            ] : null,
            'created_at' => $this->created_at->format('M d, Y'),
        ];
    }
}