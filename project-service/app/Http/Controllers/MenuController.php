<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Recipe;
use App\Models\Category;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateMenuRequest; 

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $query = Menu::with('category')->where('is_available', true);


        if ($request->has('search')) {
            $query->where('name', 'ilike', '%' . $request->search . '%');
        }

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        $allowedSorts = ['price', 'rating', 'created_at', 'name'];
        $sortBy = $request->query('sort_by', 'created_at');
        $sortOrder = $request->query('sort_order', 'desc');

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        }

        $menus = $query->paginate(12);

        return $this->successResponse($menus, 'Katalog menu berhasil diambil.');
    }

    public function getCategories()
    {
        $categories = Category::orderBy('name', 'asc')->get();
        return $this->successResponse($categories, 'Daftar kategori berhasil diambil.');
    }

  
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
            'rating' => 0, 
        ]);

        return $this->successResponse($menu, 'Menu berhasil ditambahkan ke katalog.', 201);
    }

    public function updateMenu(UpdateMenuRequest $request, $id)
    {
        $menu = Menu::findOrFail($id);
        
        $menu->update($request->only([
            'category_id', 'name', 'price', 'description', 'image_url'
        ]));

        return $this->successResponse($menu->fresh('category'), 'Data menu berhasil diperbarui.');
    }

    public function toggleAvailability($id)
    {
        $menu = Menu::findOrFail($id);
        $menu->is_available = !$menu->is_available; 
        $menu->save();

        $status = $menu->is_available ? 'Tersedia' : 'Habis (Sold Out)';
        return $this->successResponse($menu, "Status menu sekarang: $status.");
    }


    public function destroyMenu($id)
    {
        $menu = Menu::findOrFail($id);
        $menu->delete();

        return $this->successResponse(null, 'Menu berhasil dihapus permanen dari sistem.');
    }


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


   public function getInternalRecipes(Request $request)
    {
        $query = Menu::with(['category', 'recipe.ingredients'])->orderBy('created_at', 'desc');

        if ($request->has('search') && $request->search !== '') {
            $query->where('name', 'ilike', '%' . $request->search . '%');
        }
        
        if ($request->has('category') && $request->category !== 'All') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        if ($request->has('rating') && $request->rating !== '') {
            $query->where('rating', '>=', $request->rating);
        }

        return $this->successResponse($query->get(), 'Data operasional menu berhasil diambil.');
    }

    public function getIngredients()
    {
        $ingredients = Ingredient::orderBy('name', 'asc')->get();
        return $this->successResponse($ingredients, 'Master bahan baku berhasil diambil.');
    }
}