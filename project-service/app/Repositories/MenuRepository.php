<?php

namespace App\Repositories;

use App\Models\Menu;
use App\Models\Recipe;

class MenuRepository
{
    public function getPaginatedMenus(array $filters, $perPage = 12)
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

        return $query->paginate($perPage);
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

    public function findById($id, $with = []) { return Menu::with($with)->findOrFail($id); }
    public function create(array $data) { return Menu::create($data); }
    public function update(Menu $menu, array $data) { $menu->update($data); return $menu; }
    public function delete(Menu $menu) { return $menu->delete(); }
    
    public function updateOrCreateRecipe($menuId, array $data) {
        return Recipe::updateOrCreate(['menu_id' => $menuId], [
            'prep_time' => $data['prep_time'],
            'cook_time' => $data['cook_time'],
            'instructions' => $data['instructions'],
            'cost_price' => $data['cost_price'],
        ]);
    }
}