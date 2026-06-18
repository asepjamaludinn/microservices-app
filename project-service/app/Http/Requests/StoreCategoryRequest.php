<?php

namespace App\Http\Requests;

class StoreCategoryRequest extends BaseApiRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories|max:255'
        ];
    }
}