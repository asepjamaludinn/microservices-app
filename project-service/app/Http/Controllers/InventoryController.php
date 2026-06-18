<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UpdateStockRequest;
use App\Http\Requests\StoreIngredientRequest;
use App\Http\Requests\UpdateIngredientRequest;
use App\Services\InventoryService;

class InventoryController extends Controller
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index()
    {
        $ingredients = $this->inventoryService->getInventory();
        return $this->successResponse($ingredients, 'Data inventaris berhasil diambil.');
    }

    public function updateStock(UpdateStockRequest $request, $id)
    {
        try {
            $authUserId = $request->attributes->get('auth_user_id');
            $ingredient = $this->inventoryService->updateStock(
                $id, 
                $request->type, 
                $request->amount, 
                $request->reason, 
                $authUserId
            );
            return $this->successResponse($ingredient, "Stok {$ingredient->name} berhasil diperbarui.");
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function store(StoreIngredientRequest $request)
    {
        $ingredient = $this->inventoryService->createIngredient($request->validated());
        return $this->successResponse($ingredient, 'Bahan baku berhasil ditambahkan.', 201);
    }

    public function update(UpdateIngredientRequest $request, $id)
    {
        $ingredient = $this->inventoryService->updateIngredient($id, $request->validated());
        return $this->successResponse($ingredient, 'Bahan baku berhasil diperbarui.');
    }

    public function destroy($id)
    {
        try {
            $this->inventoryService->deleteIngredient($id);
            return $this->successResponse(null, 'Bahan baku berhasil dihapus.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}