<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'prep_time_mins' => $this->prep_time,
            'cook_time_mins' => $this->cook_time,
            'instructions' => $this->instructions,
            'cost_price' => (float) $this->cost_price,
            'ingredients' => IngredientResource::collection($this->whenLoaded('ingredients')),
        ];
    }
}