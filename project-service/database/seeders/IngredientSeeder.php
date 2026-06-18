<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    public function run(): void
    {
        $ingredients = [
            ['name' => 'Bawang Putih', 'unit' => 'gram', 'stock' => 5000],
            ['name' => 'Bawang Merah', 'unit' => 'gram', 'stock' => 5000],
            ['name' => 'Cabai Merah', 'unit' => 'gram', 'stock' => 2000],
            ['name' => 'Daging Sapi', 'unit' => 'gram', 'stock' => 10000],
            ['name' => 'Garam', 'unit' => 'gram', 'stock' => 5000],
            ['name' => 'Lada Hitam', 'unit' => 'gram', 'stock' => 1000],
            ['name' => 'Minyak Goreng', 'unit' => 'ml', 'stock' => 15000],
            ['name' => 'Kecap Manis', 'unit' => 'ml', 'stock' => 5000],
            ['name' => 'Telur Ayam', 'unit' => 'pcs', 'stock' => 300],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::create($ingredient);
        }
    }
}