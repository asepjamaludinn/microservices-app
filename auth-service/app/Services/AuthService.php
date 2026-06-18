<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Exception;

class AuthService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(array $data): User
    {
        return $this->userRepository->createUser($data);
    }

    public function login(array $credentials): array
    {
        if (! $token = Auth::guard('api')->attempt($credentials)) {
            throw new Exception('Kredensial tidak valid (Email/Password salah)', 401);
        }

        return $this->respondWithToken($token);
    }

    public function refresh(): array
    {
        $newToken = Auth::guard('api')->refresh();
        return $this->respondWithToken($newToken);
    }

    public function logout(): void
    {
        Auth::guard('api')->logout();
    }

    public function updatePassword(User $user, string $oldPassword, string $newPassword): void
    {
        if (!Hash::check($oldPassword, $user->password)) {
            throw new Exception('Password lama tidak sesuai', 400);
        }

        $this->userRepository->updatePassword($user, $newPassword);
    }

    public function resetPassword(string $email, string $newPassword): void
    {
        $user = $this->userRepository->findByEmail($email);
        
        if (!$user) {
            throw new Exception('User tidak ditemukan.', 404);
        }

        $this->userRepository->updatePassword($user, $newPassword);
    }

    protected function respondWithToken(string $token): array
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
            'user' => Auth::guard('api')->user()
        ];
    }
}