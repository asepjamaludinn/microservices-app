<?php

namespace App\Http\Requests;

class UpdateIngredientRequest extends BaseApiRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
            'name' => 'sometimes|required|string|max:255',
            'unit' => 'sometimes|required|string|max:50'
        ];
    }
}