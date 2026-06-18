<?php

namespace App\Services;

use App\Repositories\MenuRepository;
use App\Repositories\CategoryRepository; 
use App\Repositories\InventoryRepository;

class MenuService
{
    protected $menuRepo;
    protected $categoryRepo;
    protected $inventoryRepo;

    public function __construct(MenuRepository $menuRepo, CategoryRepository $categoryRepo, InventoryRepository $inventoryRepo)
    {
        $this->menuRepo = $menuRepo;
        $this->categoryRepo = $categoryRepo;
        $this->inventoryRepo = $inventoryRepo;
    }

    public function getMenus(array $filters) { return $this->menuRepo->getPaginatedMenus($filters); }
    public function getCategories() { return $this->categoryRepo->getAll(); }

    public function createMenu(array $data, $userId)
    {
        $data['user_id'] = $userId;
        $data['is_available'] = $data['is_available'] ?? true;
        $data['rating'] = 0;
        return $this->menuRepo->create($data);
    }

    public function updateMenu($id, array $data)
    {
        $menu = $this->menuRepo->findById($id);
        return $this->menuRepo->update($menu, $data)->load('category');
    }
    
    public function toggleAvailability($id)
    {
        $menu = $this->menuRepo->findById($id);
        return $this->menuRepo->update($menu, ['is_available' => !$menu->is_available]);
    }

   public function deleteMenu($id)
    {
        if ($this->menuRepo->hasOrderHistory($id)) {
            throw new \Exception("Menu ini tidak dapat dihapus secara permanen karena sudah memiliki riwayat pesanan. Silakan nonaktifkan status ketersediaannya (is_available) agar tidak merusak data laporan.");
        }

        $menu = $this->menuRepo->findById($id);
        $this->menuRepo->delete($menu);
    }

    public function createOrUpdateRecipe($menuId, array $data)
    {
        $recipe = $this->menuRepo->updateOrCreateRecipe($menuId, $data);

        $syncData = [];
        foreach ($data['ingredients'] as $ingredient) {
            $syncData[$ingredient['id']] = ['quantity' => $ingredient['quantity']];
        }
        
        $recipe->ingredients()->sync($syncData);
        return $recipe->load('ingredients');
    }

    public function getInternalRecipes(array $filters) { return $this->menuRepo->getInternalRecipes($filters); }
    public function getIngredients() { return $this->inventoryRepo->getAllSorted(); }
}