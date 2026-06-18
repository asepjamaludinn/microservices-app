<?php
namespace App\Repositories;
use App\Models\Ingredient;

class IngredientRepository
{
    public function getAllOrderedByStock() { return Ingredient::orderBy('stock', 'asc')->get(); }
    public function findById($id) { return Ingredient::findOrFail($id); }
    public function findAndLockForUpdate($id) { return Ingredient::lockForUpdate()->find($id); }
    public function create(array $data) { return Ingredient::create($data); }
    public function update(Ingredient $ingredient, array $data) { $ingredient->update($data); return $ingredient; }
    public function delete(Ingredient $ingredient) { $ingredient->delete(); }
    public function hasRecipes(Ingredient $ingredient) { return $ingredient->recipes()->exists(); }
}