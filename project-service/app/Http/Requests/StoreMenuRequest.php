<?php

namespace App\Http\Requests;

class StoreMenuRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
{
    return [
        'category_id' => 'required|exists:categories,id',
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric|min:0',
        'image_url' => 'nullable|string', 
        'is_available' => 'boolean', 
    ];
}
}