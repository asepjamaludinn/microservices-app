<?php

namespace App\Http\Requests;

class UpdateCategoryRequest extends BaseApiRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array {
        $id = $this->route('id');
        return [
            'name' => 'sometimes|required|string|max:255',
            'slug' => "sometimes|required|string|max:255|unique:categories,slug,{$id}"
        ];
    }
}