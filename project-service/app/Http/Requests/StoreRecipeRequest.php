<?php

namespace App\Http\Requests;

class StoreRecipeRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'prep_time' => 'required|integer|min:0',
            'cook_time' => 'required|integer|min:0',
            'instructions' => 'required|string',
            'cost_price' => 'required|numeric|min:0',
            'ingredients' => 'required|array|min:1',
            'ingredients.*.id' => 'required|exists:ingredients,id',
            'ingredients.*.quantity' => 'required|numeric|min:0.1',
        ];
    }
}