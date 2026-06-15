<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * PUBLIC: Semua orang bisa melihat daftar menu.
     */
    public function index()
    {
        $menus = Menu::with('category')->get();
        return response()->json($menus);
    }

    /**
     * ADMIN ONLY: Menambah menu baru ke katalog.
     */
    public function storeMenu(Request $request)
    {
        $category = Category::firstOrCreate(
            ['slug' => 'main-course'],
            ['name' => 'Main Course']
        );

        $menu = Menu::create([
            'category_id' => $category->id,
            'user_id' => $request->attributes->get('auth_user_id'), 
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Menu berhasil ditambahkan oleh Admin',
            'data' => $menu
        ], 201);
    }

    /**
     * ADMIN ONLY: Menambah resep rahasia dan HPP (Harga Pokok) ke menu tertentu.
     */
    public function storeRecipe(Request $request, $menuId)
    {
        $menu = Menu::findOrFail($menuId);

        $recipe = $menu->recipe()->create([
            'ingredients' => $request->ingredients,
            'instructions' => $request->instructions,
            'cost_price' => $request->cost_price,
        ]);

        return response()->json([
            'message' => 'Resep internal berhasil disimpan',
            'data' => $recipe
        ], 201);
    }

    /**
     * ADMIN ONLY: Melihat daftar menu beserta resep rahasia dan modalnya.
     */
    public function getInternalRecipes()
    {
        $menus = Menu::with('recipe')->get();
        return response()->json($menus);
    }
}