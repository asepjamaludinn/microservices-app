<?php

namespace App\Http\Requests;

use App\Http\Requests\BaseApiRequest;

class UpdatePaymentStatusRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_status' => 'required|string|in:unpaid,paid,refunded'
        ];
    }
}