<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Ingredient;
use App\Models\Menu;
use App\Models\Category;
use App\Models\Recipe;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Foundation\Testing\RefreshDatabase;

class InventoryApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        JWTAuth::shouldReceive('parseToken->getPayload')->andReturn(new class {
            public function get($key) { return $key === 'sub' ? 1 : 'admin'; }
        });
    }

    public function test_admin_can_add_stock_in()
    {
        $ingredient = Ingredient::create(['name' => 'Garam', 'unit' => 'gram', 'stock' => 100]);

        $response = $this->postJson("/api/inventory/{$ingredient->id}/stock", [
            'type' => 'in',
            'amount' => 50,
            'reason' => 'Restock mingguan'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('ingredients', ['id' => $ingredient->id, 'stock' => 150.00]);
        $this->assertDatabaseHas('audit_logs', ['action' => 'STOCK_ADDED', 'entity_id' => $ingredient->id]);
    }

    public function test_admin_cannot_remove_stock_below_zero()
    {
        $ingredient = Ingredient::create(['name' => 'Gula', 'unit' => 'gram', 'stock' => 50]);

        $response = $this->postJson("/api/inventory/{$ingredient->id}/stock", [
            'type' => 'out',
            'amount' => 100,
        ]);

        $response->assertStatus(400);
        $this->assertDatabaseHas('ingredients', ['id' => $ingredient->id, 'stock' => 50.00]); 
    }

    public function test_cannot_delete_ingredient_used_in_recipe()
    {
        $ingredient = Ingredient::create(['name' => 'Bawang', 'unit' => 'gram', 'stock' => 100]);
        $category = Category::create(['name' => 'Food', 'slug' => 'food']);
        $menu = Menu::create(['category_id' => $category->id, 'user_id' => 1, 'name' => 'Soup', 'price' => 10]);
        
        $recipe = Recipe::create(['menu_id' => $menu->id, 'prep_time' => 10, 'cook_time' => 10, 'instructions' => 'boil']);
        $recipe->ingredients()->attach($ingredient->id, ['quantity' => 10]);

        $response = $this->deleteJson("/api/inventory/{$ingredient->id}");

        $response->assertStatus(400)
                 ->assertJsonPath('message', 'Bahan baku tidak dapat dihapus karena masih digunakan dalam resep.');
    }
}