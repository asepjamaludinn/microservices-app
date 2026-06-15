<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_id', 'ingredients', 'instructions', 'cost_price'
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}