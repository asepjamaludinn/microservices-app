<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest; 
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\ResetPasswordRequest;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => User::ROLE_USER,
        ]);

        $userData = [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role
        ];

        return $this->successResponse($userData, 'User berhasil didaftarkan.', 201);
    }

    public function login(LoginRequest $request) 
    {
        $credentials = $request->only('email', 'password');

        if (! $token = Auth::guard('api')->attempt($credentials)) {
            return $this->errorResponse('Kredensial tidak valid (Email/Password salah)', 401);
        }

        return $this->respondWithToken($token);
    }

    public function me()
    {
        return $this->successResponse(Auth::guard('api')->user(), 'Data user berhasil diambil.');
    }

    public function logout()
    {
        Auth::guard('api')->logout();
        return $this->successResponse(null, 'Berhasil logout');
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = Auth::guard('api')->user();

        if (!Hash::check($request->old_password, $user->password)) {
            return $this->errorResponse('Password lama tidak sesuai', 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return $this->successResponse(null, 'Password berhasil diperbarui');
    }

    public function directResetPassword(ResetPasswordRequest $request)
    {
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->new_password);
        $user->save();

        return $this->successResponse(null, 'Password berhasil direset. Silakan login dengan password baru.');
    }

    protected function respondWithToken($token)
    {
        $data = [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60, 
            'user' => Auth::guard('api')->user()
        ];

        return $this->successResponse($data, 'Login berhasil');
    }
}