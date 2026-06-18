<?php

namespace App\Services;

use App\Repositories\InventoryRepository;
use App\Repositories\AuditLogRepository;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    protected $inventoryRepo;
    protected $auditLogRepo;
    public function __construct(
        InventoryRepository $inventoryRepo, 
        AuditLogRepository $auditLogRepo
    ) {
        $this->inventoryRepo = $inventoryRepo;
        $this->auditLogRepo = $auditLogRepo;
    }

    public function getInventory()
    {
        $ingredients = $this->inventoryRepo->getAllSorted();
        
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
            
            $ingredient = $this->inventoryRepo->findLockedById($id);
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

            $this->inventoryRepo->update($ingredient, ['stock' => $ingredient->stock]);

            $this->auditLogRepo->create([
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
        return $this->inventoryRepo->create($data);
    }

    public function updateIngredient($id, array $data)
    {
        $ingredient = $this->inventoryRepo->findById($id);
        return $this->inventoryRepo->update($ingredient, $data);
    }

    public function deleteIngredient($id)
    {
        $ingredient = $this->inventoryRepo->findById($id);
        
        if ($ingredient->recipes()->exists()) {
            throw new \Exception('Bahan baku tidak dapat dihapus karena masih digunakan dalam resep.', 400);
        }

        $this->inventoryRepo->delete($ingredient);
    }
}