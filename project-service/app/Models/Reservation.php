<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'table_id', 'customer_name', 'contact_number', 'reservation_time', 'guest_count', 'status'
    ];

    protected $casts = [
        'reservation_time' => 'datetime',
    ];

    public function table()
    {
        return $this->belongsTo(Table::class);
    }
}