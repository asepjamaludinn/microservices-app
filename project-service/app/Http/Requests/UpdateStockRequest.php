<?php

namespace App\Http\Requests;

use App\Http\Requests\BaseApiRequest;

class UpdateStockRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'required|in:in,out',
            'amount' => 'required|numeric|min:0.1',
            'reason' => 'nullable|string|max:255',
        ];
    }
}