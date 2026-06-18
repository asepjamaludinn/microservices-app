<?php

namespace App\Http\Requests;

class StoreReservationRequest extends BaseApiRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array {
        return [
            'table_id' => 'required|exists:tables,id',
            'customer_name' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'reservation_time' => 'required|date|after:now',
            'guest_count' => 'required|integer|min:1',
        ];
    }
}