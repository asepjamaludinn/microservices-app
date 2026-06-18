<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Recipe;
use Illuminate\Database\Seeder;

class MenuRecipeSeeder extends Seeder
{
    public function run(): void
    {
        $menu = Menu::create([
            'category_id' => 1, 
            'user_id' => 1, 
            'name' => 'Nasi Goreng Spesial Nusantara',
            'description' => 'Nasi goreng khas nusantara dengan telur mata sapi dan bumbu rahasia.',
            'price' => 35000,
            'image_url' => 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop',
            'rating' => 4.8,
            'is_available' => true,
        ]);

        $recipe = Recipe::create([
            'menu_id' => $menu->id,
            'prep_time' => 10,
            'cook_time' => 15,
            'instructions' => "1. Haluskan bawang merah, bawang putih, dan cabai.\n2. Panaskan minyak, tumis bumbu halus hingga harum.\n3. Masukkan telur, orak-arik.\n4. Tambahkan nasi, kecap, garam, dan lada. Aduk rata dengan api besar.\n5. Sajikan selagi hangat.",
            'cost_price' => 15000,
        ]);

        $recipe->ingredients()->attach([
            1 => ['quantity' => 15],  
            2 => ['quantity' => 20],  
            3 => ['quantity' => 10],  
            5 => ['quantity' => 5],   
            7 => ['quantity' => 30],  
            8 => ['quantity' => 25],  
            9 => ['quantity' => 2],   
        ]);
    }
}