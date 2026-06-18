<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Order;
use App\Models\Review;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReviewApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        JWTAuth::shouldReceive('parseToken->getPayload')->andReturn(new class {
            public function get($key) { return $key === 'sub' ? 5 : 'user'; }
        });
    }

    public function test_user_cannot_review_other_users_order()
    {
        $order = Order::create([
            'user_id' => 99, 'customer_name' => 'Stranger', 'order_type' => 'takeaway',
            'subtotal' => 0, 'tax_amount' => 0, 'total_amount' => 0, 'status' => 'completed', 'payment_status' => 'paid'
        ]);

        $response = $this->postJson('/api/reviews', [
            'order_id' => $order->id,
            'customer_name' => 'My Name',
            'rating' => 5,
            'comment' => 'Enak!'
        ]);

        $response->assertStatus(403)->assertJsonPath('message', 'Anda tidak diizinkan mengulas pesanan orang lain.');
    }

    public function test_user_cannot_review_incomplete_order()
    {
        $order = Order::create([
            'user_id' => 5, 'customer_name' => 'Me', 'order_type' => 'takeaway',
            'subtotal' => 0, 'tax_amount' => 0, 'total_amount' => 0, 'status' => 'pending', 'payment_status' => 'unpaid'
        ]);

        $response = $this->postJson('/api/reviews', [
            'order_id' => $order->id, 'customer_name' => 'Me', 'rating' => 5, 'comment' => 'Enak!'
        ]);

        $response->assertStatus(400)->assertJsonPath('message', 'Anda hanya dapat mengulas pesanan yang sudah selesai.');
    }

    public function test_user_can_submit_valid_review()
    {
        $order = Order::create([
            'user_id' => 5, 'customer_name' => 'Me', 'order_type' => 'takeaway',
            'subtotal' => 0, 'tax_amount' => 0, 'total_amount' => 0, 'status' => 'completed', 'payment_status' => 'paid'
        ]);

        $response = $this->postJson('/api/reviews', [
            'order_id' => $order->id, 'customer_name' => 'Me', 'rating' => 5, 'comment' => 'Mantap!'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('reviews', ['order_id' => $order->id, 'comment' => 'Mantap!']);
    }

    public function test_user_cannot_submit_duplicate_review()
    {
        $order = Order::create([
            'user_id' => 5, 'customer_name' => 'Me', 'order_type' => 'takeaway',
            'subtotal' => 0, 'tax_amount' => 0, 'total_amount' => 0, 'status' => 'completed', 'payment_status' => 'paid'
        ]);

        Review::create(['order_id' => $order->id, 'customer_name' => 'Me', 'rating' => 4, 'comment' => 'Good']);
        $response = $this->postJson('/api/reviews', [
            'order_id' => $order->id, 'customer_name' => 'Me', 'rating' => 5, 'comment' => 'Review Kedua!'
        ]);

        $response->assertStatus(400)->assertJsonPath('message', 'Anda sudah memberikan ulasan untuk pesanan ini.');
    }
}