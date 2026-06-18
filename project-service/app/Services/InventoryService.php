<?php

namespace App\Services;

use App\Models\Ingredient;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    public function getInventory()
    {
        $ingredients = Ingredient::orderBy('stock', 'asc')->get();
        $ingredients->transform(function ($item) {
            $item->status = $item->stock <= 1000 ? 'Low Stock' : 'Available';
            $item->image_url = null; 
            return $item;
        });
        return $ingredients;
    }

    public function updateStock($id, $type, $amount, $reason, $authUserId)
    {
        return DB::transaction(function () use ($id, $type, $amount, $reason, $authUserId) {
            $ingredient = Ingredient::lockForUpdate()->findOrFail($id);
            $oldStock = $ingredient->stock;

            if ($type === 'in') {
                $ingredient->stock += $amount;
                $action = 'STOCK_ADDED';
            } else {
                if ($ingredient->stock < $amount) {
                    throw new \Exception("Stok {$ingredient->name} tidak cukup untuk dikeluarkan.");
                }
                $ingredient->stock -= $amount;
                $action = 'STOCK_REMOVED';
            }

            $ingredient->save();

            AuditLog::create([
                'user_id' => $authUserId,
                'action' => $action,
                'entity_type' => 'Ingredient',
                'entity_id' => $ingredient->id,
                'details' => json_encode([
                    'amount_changed' => $amount,
                    'old_stock' => $oldStock,
                    'new_stock' => $ingredient->stock,
                    'reason' => $reason
                ])
            ]);

            return $ingredient;
        });
    }

    public function createIngredient(array $data)
    {
        return Ingredient::create($data);
    }

    public function updateIngredient($id, array $data)
    {
        $ingredient = Ingredient::findOrFail($id);
        $ingredient->update($data);
        return $ingredient;
    }

    public function deleteIngredient($id)
    {
        $ingredient = Ingredient::findOrFail($id);
        
        if ($ingredient->recipes()->exists()) {
            throw new \Exception('Bahan baku tidak dapat dihapus karena masih digunakan dalam resep.', 400);
        }

        $ingredient->delete();
    }
}