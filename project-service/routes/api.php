<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\PaymentController;

Route::get('menus', [MenuController::class, 'index']);
Route::get('categories', [MenuController::class, 'getCategories']);
Route::get('reviews', [ReviewController::class, 'index']); 

Route::middleware(['jwt.role:admin,user'])->group(function () {
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('my-orders', [OrderController::class, 'myOrders']);
    Route::post('reviews', [ReviewController::class, 'store']); 
});

Route::middleware(['jwt.role:admin'])->group(function () {
    Route::get('analytics', [OrderController::class, 'getAnalytics']);
    
    // CRUD Kategori
    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{id}', [CategoryController::class, 'update']);
    Route::delete('categories/{id}', [CategoryController::class, 'destroy']);

    // Manajemen Menu Utama
    Route::post('menus', [MenuController::class, 'storeMenu']);
    Route::put('menus/{id}', [MenuController::class, 'updateMenu']);
    Route::delete('menus/{id}', [MenuController::class, 'destroyMenu']);
    Route::patch('menus/{id}/status', [MenuController::class, 'toggleAvailability']);
    
    // Manajemen Resep
    Route::get('ingredients', [MenuController::class, 'getIngredients']);
    Route::post('menus/{id}/recipes', [MenuController::class, 'storeRecipe']);
    Route::get('internal/recipes', [MenuController::class, 'getInternalRecipes']);

    // Transaksi & POS
    Route::get('orders', [OrderController::class, 'index']); 
    Route::patch('orders/{id}/status', [OrderController::class, 'updateStatus']); 
    Route::patch('orders/{id}/payment-status', [OrderController::class, 'updatePaymentStatus']); 

    // Manajemen Meja
    Route::get('tables', [TableController::class, 'index']);
    Route::post('tables', [TableController::class, 'store']);
    Route::patch('tables/{id}/status', [TableController::class, 'updateStatus']);
    Route::delete('tables/{id}', [TableController::class, 'destroy']); 

    Route::get('reservations', [ReservationController::class, 'index']);
    Route::post('reservations', [ReservationController::class, 'store']);
    Route::get('reservations/{id}', [ReservationController::class, 'show']);
    Route::patch('reservations/{id}/confirm', [ReservationController::class, 'confirm']);
    Route::patch('reservations/{id}/cancel', [ReservationController::class, 'cancel']);
    Route::patch('reservations/{id}/complete', [ReservationController::class, 'complete']);

    Route::get('payments', [PaymentController::class, 'index']);
    Route::get('payments/{id}', [PaymentController::class, 'show']);
    Route::get('orders/{id}/payment', [PaymentController::class, 'showByOrder']);
    Route::post('orders/{id}/pay', [PaymentController::class, 'store']);
    Route::post('payments/{id}/refund', [PaymentController::class, 'refund']);

    
    // Manajemen Inventaris 
    Route::get('inventory', [InventoryController::class, 'index']);
    Route::post('inventory', [InventoryController::class, 'store']); 
    Route::put('inventory/{id}', [InventoryController::class, 'update']); 
    Route::delete('inventory/{id}', [InventoryController::class, 'destroy']); 
    Route::post('inventory/{id}/stock', [InventoryController::class, 'updateStock']); 

    Route::get('audit-logs', [AuditLogController::class, 'index']);
});