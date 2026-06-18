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
     * Test 3: User tidak bisa set role admin dari body request (Security).
     */
    public function test_user_cannot_set_admin_role_during_registration(): void
    {
        $payload = [
            'name' => 'Hacker Wannabe',
            'email' => 'hacker@example.com',
            'password' => 'SandiKuat123!',
            'role' => 'admin' 
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'hacker@example.com',
            'role' => User::ROLE_USER, 
        ]);
    }

    /**
     * Test 4: User dapat login dengan kredensial yang benar.
     */
    public function test_user_can_login_with_correct_credentials(): void
    {
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
     * Test 5: Login gagal jika password salah.
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

    /**
     * Test 6: Hit rate limit ketika login gagal berkali-kali.
     */
    public function test_login_hits_rate_limit_after_too_many_attempts(): void
    {
        $payload = [
            'email' => 'bruteforce@example.com',
            'password' => 'SalahTerus123!'
        ];

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', $payload);
        }
        $response = $this->postJson('/api/login', $payload);

        $response->assertStatus(429); 
    }

    /**
     * Test 7: User dapat logout dengan sukses.
     */
    public function test_user_can_logout_successfully(): void
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/logout');

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'Success',
            'message' => 'Berhasil logout. Token telah di-invalidasi.'
        ]);
    }

    /**
     * Test 8: Akses /me ditolak jika token tidak valid/kosong.
     */
    public function test_cannot_access_me_endpoint_with_invalid_token(): void
    {
        $response = $this->withHeader('Authorization', 'Bearer invalid.token.string')
                         ->getJson('/api/me');

        $response->assertStatus(401); 
    }

    /**
     * Test 9: Update password berhasil dengan password lama yang benar.
     */
    public function test_user_can_update_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('OldPassword123!')
        ]);
        $token = auth('api')->login($user);

        $payload = [
            'old_password' => 'OldPassword123!',
            'new_password' => 'NewStrongPass123!'
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/update-password', $payload);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'Success',
            'message' => 'Password berhasil diperbarui'
        ]);

        $this->assertTrue(Hash::check('NewStrongPass123!', $user->fresh()->password));
    }

    /**
     * Test 10: Update password gagal jika password lama salah.
     */
    public function test_update_password_fails_if_old_password_is_wrong(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('OldPassword123!')
        ]);
        $token = auth('api')->login($user);

        $payload = [
            'old_password' => 'SalahTebak123!', 
            'new_password' => 'NewStrongPass123!'
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/update-password', $payload);

        $response->assertStatus(400);
        $response->assertJson([
            'status' => 'Error',
            'message' => 'Password lama tidak sesuai'
        ]);
    }

    /**
     * Test 11: Reset password gagal jika email tidak ditemukan di database.
     */
    public function test_direct_reset_password_fails_for_unregistered_email(): void
    {
        $payload = [
            'email' => 'tidakada@example.com',
            'new_password' => 'PasswordBaru123!'
        ];

        $response = $this->postJson('/api/reset-password-direct', $payload);

        $response->assertStatus(422);
        $response->assertJsonStructure([
            'status',
            'message',
            'errors' => [
                'email'
            ]
        ]);
    }
}