<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\UpdateStockRequest;
use App\Http\Requests\StoreIngredientRequest;
use App\Http\Requests\UpdateIngredientRequest;

class InventoryController extends Controller
{
    public function index()
    {
        $ingredients = Ingredient::orderBy('stock', 'asc')->get();
        $ingredients->transform(function ($item) {
            $item->status = $item->stock <= 1000 ? 'Low Stock' : 'Available';
            $item->image_url = null; 
            return $item;
        });

        return $this->successResponse($ingredients, 'Data inventaris berhasil diambil.');
    }

    public function updateStock(UpdateStockRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $ingredient = Ingredient::lockForUpdate()->findOrFail($id);
            $authUserId = $request->attributes->get('auth_user_id');

            $oldStock = $ingredient->stock;

            if ($request->type === 'in') {
                $ingredient->stock += $request->amount;
                $action = 'STOCK_ADDED';
            } else {
                if ($ingredient->stock < $request->amount) {
                    throw new \Exception("Stok {$ingredient->name} tidak cukup untuk dikeluarkan.");
                }
                $ingredient->stock -= $request->amount;
                $action = 'STOCK_REMOVED';
            }

            $ingredient->save();

            AuditLog::create([
                'user_id' => $authUserId,
                'action' => $action,
                'entity_type' => 'Ingredient',
                'entity_id' => $ingredient->id,
                'details' => json_encode([
                    'amount_changed' => $request->amount,
                    'old_stock' => $oldStock,
                    'new_stock' => $ingredient->stock,
                    'reason' => $request->reason
                ])
            ]);

            DB::commit();

            return $this->successResponse($ingredient, "Stok {$ingredient->name} berhasil diperbarui.");
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function store(StoreIngredientRequest $request)
    {
        $ingredient = Ingredient::create($request->all());
        return $this->successResponse($ingredient, 'Bahan baku berhasil ditambahkan.', 201);
    }

    public function update(UpdateIngredientRequest $request, $id)
    {
        $ingredient = Ingredient::findOrFail($id);
        $ingredient->update($request->all());
        return $this->successResponse($ingredient, 'Bahan baku berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $ingredient = Ingredient::findOrFail($id);
        if ($ingredient->recipes()->exists()) {
            return $this->errorResponse('Bahan baku tidak dapat dihapus karena masih digunakan dalam resep.', 400);
        }

        $ingredient->delete();
        return $this->successResponse(null, 'Bahan baku berhasil dihapus.');
    }
}