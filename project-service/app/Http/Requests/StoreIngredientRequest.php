<?php

namespace App\Http\Requests;

class StoreIngredientRequest extends BaseApiRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'stock' => 'nullable|numeric|min:0'
        ];
    }
}