<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    public function run(): void
    {
        $ingredients = [
            ['name' => 'Bawang Putih', 'unit' => 'gram'],
            ['name' => 'Bawang Merah', 'unit' => 'gram'],
            ['name' => 'Cabai Merah', 'unit' => 'gram'],
            ['name' => 'Daging Sapi', 'unit' => 'gram'],
            ['name' => 'Garam', 'unit' => 'gram'],
            ['name' => 'Lada Hitam', 'unit' => 'gram'],
            ['name' => 'Minyak Goreng', 'unit' => 'ml'],
            ['name' => 'Kecap Manis', 'unit' => 'ml'],
            ['name' => 'Telur Ayam', 'unit' => 'pcs'],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::create($ingredient);
        }
    }
}