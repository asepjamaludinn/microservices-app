<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Category;
use App\Models\Menu;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase; 

    protected function setUp(): void
    {
        parent::setUp();
        
        JWTAuth::shouldReceive('parseToken->getPayload')->andReturn(new class {
            public function get($key) { return $key === 'sub' ? 1 : 'admin'; }
        });
    }

    public function test_admin_can_create_category()
    {
        $response = $this->postJson('/api/categories', [
            'name' => 'Dessert',
            'slug' => 'dessert-01'
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Dessert');
                 
        $this->assertDatabaseHas('categories', ['slug' => 'dessert-01']);
    }

    public function test_admin_can_delete_empty_category()
    {
        $category = Category::create(['name' => 'Snack', 'slug' => 'snack']);

        $response = $this->deleteJson('/api/categories/' . $category->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_admin_cannot_delete_category_with_menus()
    {
        $category = Category::create(['name' => 'Main Course', 'slug' => 'main-course']);
        
        Menu::create([
            'category_id' => $category->id,
            'user_id' => 1,
            'name' => 'Nasi Goreng',
            'price' => 20000
        ]);

        $response = $this->deleteJson('/api/categories/' . $category->id);

        
        $response->assertStatus(400)
                 ->assertJsonPath('message', 'Kategori tidak dapat dihapus karena masih digunakan oleh beberapa menu.');
                 
        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }
}