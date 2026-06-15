<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Daftarkan user baru.
     */
    public function register(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role_id' => 'nullable|exists:roles,id', // Opsional, validasi ke tabel roles
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Simpan user ke database
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id ?? 2, // Asumsi role_id '2' adalah 'user/customer'
        ]);

        // Opsional: Langsung login setelah register
        // $token = Auth::guard('api')->login($user);
        // return $this->respondWithToken($token);

        return response()->json([
            'message' => 'User berhasil didaftarkan.',
            'user' => $user
        ], 201);
    }

    /**
     * Proses Login dan dapatkan JWT.
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // Autentikasi menggunakan guard 'api' (JWT)
        if (! $token = Auth::guard('api')->attempt($credentials)) {
            return response()->json(['error' => 'Kredensial tidak valid (Email/Password salah)'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Ambil data user yang sedang login (berdasarkan token).
     */
    public function me()
    {
        return response()->json(Auth::guard('api')->user());
    }

    /**
     * Hapus token (Logout).
     */
    public function logout()
    {
        Auth::guard('api')->logout();

        return response()->json(['message' => 'Berhasil logout']);
    }

    /**
     * Struktur ulang format balasan Token.
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60, 
            'user' => Auth::guard('api')->user()
        ]);
    }
}