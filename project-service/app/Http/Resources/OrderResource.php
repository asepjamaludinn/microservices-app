<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name,
            'order_type' => $this->order_type,
            'delivery_address' => $this->delivery_address,
            'subtotal' => (float) $this->subtotal,
            'tax_amount' => (float) $this->tax_amount,
            'total_amount' => (float) $this->total_amount,
            'status' => $this->status,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'table' => new TableResource($this->whenLoaded('table')),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}