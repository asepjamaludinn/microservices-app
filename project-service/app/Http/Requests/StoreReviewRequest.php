<?php

namespace App\Http\Requests;

class StoreReviewRequest extends BaseApiRequest
{
    public function authorize(): bool { return true; }
    
    public function rules(): array {
        return [
            'menu_id' => 'required|exists:menus,id', 
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
        ];
    }
}