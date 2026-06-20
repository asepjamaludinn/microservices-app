<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review; 

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            IngredientSeeder::class,
            MenuRecipeSeeder::class,
        ]);

        Review::create([
            'menu_id' => 1, 
            'customer_name' => 'Alice Johnson',
            'rating' => 5,
            'comment' => 'Makanan luar biasa, Nasi Goreng Nusantara-nya benar-benar juara bumbunya!',
        ]);

        Review::create([
            'menu_id' => 1, 
            'customer_name' => 'Bob Smith',
            'rating' => 4,
            'comment' => 'Porsinya banyak, tapi ayamnya agak sedikit keasinan bagi lidah saya. Overall good!',
        ]);

        Review::create([
            'menu_id' => 1, 
            'customer_name' => 'Asep Jamaludin',
            'rating' => 5,
            'comment' => 'Sistem pemesanannya sangat cepat, tidak perlu nunggu lama makanan langsung datang.',
        ]);
    }
}