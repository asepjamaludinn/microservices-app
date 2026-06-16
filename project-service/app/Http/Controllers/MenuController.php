<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Recipe;
use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\StoreRecipeRequest;

class MenuController extends Controller
{
    /**
     * PUBLIC: Semua orang bisa melihat daftar menu.
     */
    public function index()
    {
        $menus = Menu::with('category')->where('is_available', true)->get();
        return $this->successResponse($menus, 'Katalog menu berhasil diambil.');
    }

    /**
     * ADMIN ONLY: Menambah menu baru ke katalog.
     */
    public function storeMenu(StoreMenuRequest $request)
    {
        $menu = Menu::create([
            'category_id' => $request->category_id,
            'user_id' => $request->attributes->get('auth_user_id'), 
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'image_url' => $request->image_url, 
            'is_available' => $request->is_available ?? true,
        ]);

        return $this->successResponse($menu, 'Menu berhasil ditambahkan ke katalog.', 201);
    }

    /**
     * ADMIN ONLY: Menambah resep rahasia dan menyimpan relasi bahan (Pivot Table).
     */
    public function storeRecipe(StoreRecipeRequest $request, $menuId)
    {
        $menu = Menu::findOrFail($menuId);
        $recipe = Recipe::updateOrCreate(
            ['menu_id' => $menu->id],
            [
                'prep_time' => $request->prep_time,
                'cook_time' => $request->cook_time,
                'instructions' => $request->instructions,
                'cost_price' => $request->cost_price,
            ]
        );

        $syncData = [];
        foreach ($request->ingredients as $ingredient) {
            $syncData[$ingredient['id']] = ['quantity' => $ingredient['quantity']];
        }
        
        $recipe->ingredients()->sync($syncData);

        return $this->successResponse(
            $recipe->load('ingredients'), 
            'Resep internal dan komposisi bahan berhasil disimpan.', 
            201
        );
    }

    /**
     * ADMIN ONLY: Melihat daftar menu beserta resep rahasia dan modalnya.
     */
    public function getInternalRecipes()
    {
        $menus = Menu::with(['category', 'recipe.ingredients'])->orderBy('created_at', 'desc')->get();
        return $this->successResponse($menus, 'Data resep internal berhasil diambil.');
    }

    
    public function update(StoreMenuRequest $request, $id)
    {
        $menu = Menu::findOrFail($id);
        
        $menu->update([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'image_url' => $request->image_url,
            'is_available' => $request->is_available ?? $menu->is_available,
        ]);

        return $this->successResponse($menu, 'Menu berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);
        $menu->delete();

        return $this->successResponse(null, 'Menu berhasil dihapus.');
    }
}

