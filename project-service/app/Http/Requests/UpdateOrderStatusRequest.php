<?php

namespace App\Http\Requests;

use App\Http\Requests\BaseApiRequest;

class UpdateOrderStatusRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|string|in:pending,cooking,ready,completed,cancelled'
        ];
    }
}