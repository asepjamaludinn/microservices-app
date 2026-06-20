<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = ['menu_id', 'customer_name', 'rating', 'comment'];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}