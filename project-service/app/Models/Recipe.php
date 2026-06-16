<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_id', 'prep_time', 'cook_time', 'instructions', 'cost_price'
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredients')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}