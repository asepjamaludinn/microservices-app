<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateMenuRequest;
use App\Services\MenuService;

class MenuController extends Controller
{
    protected $menuService;

    public function __construct(MenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    public function index(Request $request)
    {
        $menus = $this->menuService->getMenus($request->all());
        return $this->successResponse($menus, 'Katalog menu berhasil diambil.');
    }

    public function getCategories()
    {
        $categories = $this->menuService->getCategories();
        return $this->successResponse($categories, 'Daftar kategori berhasil diambil.');
    }

    public function storeMenu(StoreMenuRequest $request)
    {
        $authUserId = $request->attributes->get('auth_user_id');
        $menu = $this->menuService->createMenu($request->validated(), $authUserId);
        return $this->successResponse($menu, 'Menu berhasil ditambahkan ke katalog.', 201);
    }

    public function updateMenu(UpdateMenuRequest $request, $id)
    {
        $menu = $this->menuService->updateMenu($id, $request->validated());
        return $this->successResponse($menu, 'Data menu berhasil diperbarui.');
    }

    public function toggleAvailability($id)
    {
        $menu = $this->menuService->toggleAvailability($id);
        $status = $menu->is_available ? 'Tersedia' : 'Habis (Sold Out)';
        return $this->successResponse($menu, "Status menu sekarang: $status.");
    }

    public function destroyMenu($id)
    {
        $this->menuService->deleteMenu($id);
        return $this->successResponse(null, 'Menu berhasil dihapus permanen dari sistem.');
    }

    public function storeRecipe(StoreRecipeRequest $request, $menuId)
    {
        $recipe = $this->menuService->createOrUpdateRecipe($menuId, $request->validated());
        return $this->successResponse($recipe, 'Resep internal dan komposisi bahan berhasil disimpan.', 201);
    }

    public function getInternalRecipes(Request $request)
    {
        $recipes = $this->menuService->getInternalRecipes($request->all());
        return $this->successResponse($recipes, 'Data operasional menu berhasil diambil.');
    }

    public function getIngredients()
    {
        $ingredients = $this->menuService->getIngredients();
        return $this->successResponse($ingredients, 'Master bahan baku berhasil diambil.');
    }
}