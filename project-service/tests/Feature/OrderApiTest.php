<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Table;
use App\Models\Menu;
use App\Models\Category;
use App\Models\Recipe;
use App\Models\Ingredient;
use App\Models\Order;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    protected $table, $menu, $ingredient;

    protected function setUp(): void
    {
        parent::setUp();
        JWTAuth::shouldReceive('parseToken->getPayload')->andReturn(new class {
            public function get($key) { return $key === 'sub' ? 2 : 'admin'; } 
        });

        $this->table = Table::create(['table_number' => '1', 'status' => 'available', 'area' => 'A']);
        $category = Category::create(['name' => 'Food', 'slug' => 'food']);
        $this->menu = Menu::create(['category_id' => $category->id, 'user_id' => 1, 'name' => 'Steak', 'price' => 50000, 'is_available' => true]);
        
        $this->ingredient = Ingredient::create(['name' => 'Daging', 'unit' => 'gram', 'stock' => 1000]); 
        
        $recipe = Recipe::create(['menu_id' => $this->menu->id, 'prep_time' => 5, 'cook_time' => 15, 'instructions' => 'Grill']);
        $recipe->ingredients()->attach($this->ingredient->id, ['quantity' => 200]);
    }

    public function test_create_order_deducts_stock_and_locks_table()
    {
        $response = $this->postJson('/api/orders', [
            'customer_name' => 'John Doe',
            'order_type' => 'dine_in',
            'table_id' => $this->table->id,
            'payment_method' => 'cash',
            'items' => [
                ['menu_id' => $this->menu->id, 'quantity' => 2]
            ]
        ]);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('ingredients', ['id' => $this->ingredient->id, 'stock' => 600.00]);
   
        $this->assertDatabaseHas('tables', ['id' => $this->table->id, 'status' => 'in_use']);
        
        $this->assertDatabaseHas('orders', ['customer_name' => 'John Doe', 'payment_status' => 'unpaid']);
    }

    public function test_cannot_create_order_if_stock_insufficient()
    {
        $response = $this->postJson('/api/orders', [
            'customer_name' => 'John Doe',
            'order_type' => 'takeaway',
            'payment_method' => 'cash',
            'items' => [
                ['menu_id' => $this->menu->id, 'quantity' => 6] 
            ]
        ]);

        $response->assertStatus(400); 
        $this->assertDatabaseHas('ingredients', ['id' => $this->ingredient->id, 'stock' => 1000.00]);
    }

    public function test_cancelling_paid_order_refunds_stock_and_payment_status()
    {
        $order = Order::create([
            'user_id' => 2, 'customer_name' => 'Test', 'order_type' => 'takeaway',
            'subtotal' => 50000, 'tax_amount' => 0, 'total_amount' => 50000,
            'status' => 'pending', 'payment_method' => 'cash', 'payment_status' => 'paid' 
        ]);

        $order->items()->create(['menu_id' => $this->menu->id, 'quantity' => 1, 'price' => 50000, 'subtotal' => 50000]);
        $this->ingredient->stock = 800; 
        $this->ingredient->save();

        $response = $this->patchJson("/api/orders/{$order->id}/status", [
            'status' => 'cancelled'
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('ingredients', ['id' => $this->ingredient->id, 'stock' => 1000.00]);
        
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'payment_status' => 'refunded']);
    }
}