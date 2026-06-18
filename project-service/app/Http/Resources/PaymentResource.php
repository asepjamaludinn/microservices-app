<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'receipt_number' => $this->receipt_number,
            'order_id' => $this->order_id,
            'amount_paid' => (float) $this->amount_paid,
            'change_amount' => (float) $this->change_amount,
            'paid_at' => $this->paid_at->toDateTimeString(),
            'order' => new OrderResource($this->whenLoaded('order')),
        ];
    }
}