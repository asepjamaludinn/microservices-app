<?php

namespace App\Http\Requests;

use App\Http\Requests\BaseApiRequest;

class StoreOrderRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|max:255',
            'order_type' => 'required|string|in:dine_in,takeaway,online', 
            'table_id' => 'nullable|exists:tables,id',
            'delivery_address' => 'required_if:order_type,online|nullable|string',
            'payment_method' => 'required|string|in:cash,qris,card',
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string|max:255',
        ];
    }
}