<?php

namespace App\Http\Requests;

class StoreReviewRequest extends BaseApiRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
            'order_id' => 'required|exists:orders,id',
            'customer_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
        ];
    }
}