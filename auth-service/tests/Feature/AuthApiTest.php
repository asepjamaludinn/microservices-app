<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test 1: User dapat mendaftar dengan data yang valid.
     */
    public function test_user_can_register_with_valid_data(): void
    {
        $payload = [
            'name' => 'Asep Jamaludin',
            'email' => 'asep.test@example.com',
            'password' => 'Rahasia123!'
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201);

        $response->assertJsonStructure([
            'status',
            'message',
            'data' => [
                'name',
                'email',
                'role'
            ]
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'asep.test@example.com',
            'role' => User::ROLE_USER,
        ]);
    }

    /**
     * Test 2: Pendaftaran gagal jika password terlalu lemah.
     */
    public function test_registration_fails_if_password_is_weak(): void
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422);

        $response->assertJsonStructure([
            'status',
            'message',
            'errors' => [
                'password' 
            ]
        ]);
    }

    /**
     * Test 3: User dapat login dengan kredensial yang benar.
     */
    public function test_user_can_login_with_correct_credentials(): void
    {
        // Setup: Buat user palsu di memory database
        User::factory()->create([
            'email' => 'login.test@example.com',
            'password' => Hash::make('ValidPassword123!')
        ]);

        $payload = [
            'email' => 'login.test@example.com',
            'password' => 'ValidPassword123!'
        ];

        $response = $this->postJson('/api/login', $payload);

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'status',
            'message',
            'data' => [
                'access_token',
                'token_type',
                'expires_in',
                'user'
            ]
        ]);
    }

    /**
     * Test 4: Login gagal jika password salah.
     */
    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'wrong.test@example.com',
            'password' => Hash::make('ValidPassword123!')
        ]);

        $payload = [
            'email' => 'wrong.test@example.com',
            'password' => 'SalahPassword!'
        ];

        $response = $this->postJson('/api/login', $payload);

        $response->assertStatus(401);
        
        $response->assertJson([
            'status' => 'Error',
            'message' => 'Kredensial tidak valid (Email/Password salah)',
            'data' => null
        ]);
    }
}