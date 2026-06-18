<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IngredientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'unit' => $this->unit,
            'stock' => (float) $this->stock,
            'status' => $this->stock <= 1000 ? 'Low Stock' : 'Available',
            'required_quantity' => $this->whenPivotLoaded('recipe_ingredients', function () {
                return (float) $this->pivot->quantity;
            }),
        ];
    }
}