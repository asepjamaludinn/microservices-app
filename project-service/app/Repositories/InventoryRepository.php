<?php
namespace App\Repositories;

use App\Models\Ingredient;

class InventoryRepository
{
    public function getAllSorted()
    {
        return Ingredient::orderBy('stock', 'asc')->get();
    }

    public function findById($id)
    {
        return Ingredient::findOrFail($id);
    }

    public function findLockedById($id)
    {
        return Ingredient::lockForUpdate()->find($id);
    }

    public function create(array $data)
    {
        return Ingredient::create($data);
    }

    public function update(Ingredient $ingredient, array $data)
    {
        $ingredient->update($data);
        return $ingredient;
    }

    public function delete(Ingredient $ingredient)
    {
        return $ingredient->delete();
    }
}