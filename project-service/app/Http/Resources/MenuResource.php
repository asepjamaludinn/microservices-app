<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float) $this->price,
            'image_url' => $this->image_url,
            'rating' => (float) $this->rating,
            'is_available' => (bool) $this->is_available,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'recipe' => new RecipeResource($this->whenLoaded('recipe')),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}