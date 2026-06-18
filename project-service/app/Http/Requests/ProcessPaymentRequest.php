<?php

namespace App\Http\Requests;

class ProcessPaymentRequest extends BaseApiRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array {
        return [
            'amount_paid' => 'required|numeric|min:0',
        ];
    }
}