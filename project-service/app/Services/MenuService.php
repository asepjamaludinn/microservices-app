<?php

namespace App\Services;

use App\Models\Menu;
use App\Models\Category;
use App\Models\Recipe;
use App\Models\Ingredient;

class MenuService
{
    public function getMenus(array $filters)
    {
        $query = Menu::with('category')->where('is_available', true);

        if (!empty($filters['search'])) {
            $query->where('name', 'ilike', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['category'])) {
            $query->whereHas('category', function ($q) use ($filters) {
                $q->where('slug', $filters['category']);
            });
        }

        $allowedSorts = ['price', 'rating', 'created_at', 'name'];
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        }

        return $query->paginate(12);
    }

    public function getCategories()
    {
        return Category::orderBy('name', 'asc')->get();
    }

    public function createMenu(array $data, $userId)
    {
        $data['user_id'] = $userId;
        $data['is_available'] = $data['is_available'] ?? true;
        $data['rating'] = 0;
        return Menu::create($data);
    }

    public function updateMenu($id, array $data)
    {
        $menu = Menu::findOrFail($id);
        $menu->update($data);
        return $menu->fresh('category');
    }

    public function toggleAvailability($id)
    {
        $menu = Menu::findOrFail($id);
        $menu->is_available = !$menu->is_available;
        $menu->save();
        return $menu;
    }

    public function deleteMenu($id)
    {
        $menu = Menu::findOrFail($id);
        $menu->delete();
    }

    public function createOrUpdateRecipe($menuId, array $data)
    {
        $menu = Menu::findOrFail($menuId);
        $recipe = Recipe::updateOrCreate(
            ['menu_id' => $menu->id],
            [
                'prep_time' => $data['prep_time'],
                'cook_time' => $data['cook_time'],
                'instructions' => $data['instructions'],
                'cost_price' => $data['cost_price'],
            ]
        );

        $syncData = [];
        foreach ($data['ingredients'] as $ingredient) {
            $syncData[$ingredient['id']] = ['quantity' => $ingredient['quantity']];
        }
        
        $recipe->ingredients()->sync($syncData);
        return $recipe->load('ingredients');
    }

    public function getInternalRecipes(array $filters)
    {
        $query = Menu::with(['category', 'recipe.ingredients'])->orderBy('created_at', 'desc');

        if (!empty($filters['search'])) {
            $query->where('name', 'ilike', '%' . $filters['search'] . '%');
        }
        
        if (!empty($filters['category']) && $filters['category'] !== 'All') {
            $query->whereHas('category', function ($q) use ($filters) {
                $q->where('name', $filters['category']);
            });
        }

        if (!empty($filters['rating'])) {
            $query->where('rating', '>=', $filters['rating']);
        }

        return $query->get();
    }

    public function getIngredients()
    {
        return Ingredient::orderBy('name', 'asc')->get();
    }
}