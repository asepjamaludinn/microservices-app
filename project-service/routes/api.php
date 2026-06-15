<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;

Route::get('menus', [MenuController::class, 'index']);



Route::middleware(['jwt.role:admin'])->group(function () {
    
    // CRUD Katalog Menu
    Route::post('menus', [MenuController::class, 'storeMenu']);
    
    // CRUD Resep Internal & HPP
    Route::post('menus/{id}/recipes', [MenuController::class, 'storeRecipe']);
    Route::get('internal/recipes', [MenuController::class, 'getInternalRecipes']);
    
});