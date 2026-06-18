<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name,
            'contact_number' => $this->contact_number,
            'reservation_time' => $this->reservation_time->toDateTimeString(),
            'guest_count' => (int) $this->guest_count,
            'status' => $this->status,
            'table' => new TableResource($this->whenLoaded('table')),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}