<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'user_id', 'name', 'description', 'price', 'image_url', 'rating', 'is_available'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function recipe()
    {
        return $this->hasOne(Recipe::class);
    }
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}