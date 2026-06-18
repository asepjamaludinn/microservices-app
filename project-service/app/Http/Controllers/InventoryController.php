<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UpdateStockRequest;
use App\Http\Requests\StoreIngredientRequest;
use App\Http\Requests\UpdateIngredientRequest;
use App\Services\InventoryService;
use App\Http\Resources\IngredientResource;

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
        return $this->successResponse(IngredientResource::collection($ingredients), 'Data inventaris berhasil diambil.');
    }

    public function updateStock(UpdateStockRequest $request, $id)
    {
        $authUserId = $request->attributes->get('auth_user_id');
        $ingredient = $this->inventoryService->updateStock(
            $id, 
            $request->type, 
            $request->amount, 
            $request->reason, 
            $authUserId
        );

        return $this->successResponse(new IngredientResource($ingredient), "Stok {$ingredient->name} berhasil diperbarui.");
    }

    public function store(StoreIngredientRequest $request)
    {
        $ingredient = $this->inventoryService->createIngredient($request->validated());
        return $this->successResponse(new IngredientResource($ingredient), 'Bahan baku berhasil ditambahkan.', 201);
    }

    public function update(UpdateIngredientRequest $request, $id)
    {
        $ingredient = $this->inventoryService->updateIngredient($id, $request->validated());
        return $this->successResponse(new IngredientResource($ingredient), 'Bahan baku berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->inventoryService->deleteIngredient($id);
        return $this->successResponse(null, 'Bahan baku berhasil dihapus.');
    }
}