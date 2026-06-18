<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\AuthService;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest; 
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Http\Resources\AuthTokenResource;
use Exception;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        $user = $this->authService->register($request->validated());

        return $this->successResponse(
            new UserResource($user), 
            'User berhasil didaftarkan.', 
            201
        );
    }

    public function login(LoginRequest $request) 
    {
        try {
            $tokenData = $this->authService->login($request->only('email', 'password'));

            return $this->successResponse(
                new AuthTokenResource($tokenData), 
                'Login berhasil'
            );
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode() ?: 401);
        }
    }

    public function refresh()
    {
        try {
            $tokenData = $this->authService->refresh();

            return $this->successResponse(
                new AuthTokenResource($tokenData), 
                'Token berhasil diperbarui'
            );
        } catch (Exception $e) {
            return $this->errorResponse('Gagal memperbarui token. Token mungkin sudah tidak valid.', 401);
        }
    }

    public function me()
    {
        $user = Auth::guard('api')->user();

        return $this->successResponse(
            new UserResource($user), 
            'Data user berhasil diambil.'
        );
    }

    public function logout()
    {
        $this->authService->logout();
        
        return $this->successResponse(null, 'Berhasil logout. Token telah di-invalidasi.');
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        try {
            $user = Auth::guard('api')->user();
            $this->authService->updatePassword($user, $request->old_password, $request->new_password);

            return $this->successResponse(null, 'Password berhasil diperbarui');
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    public function directResetPassword(ResetPasswordRequest $request)
    {
        try {
            $this->authService->resetPassword($request->email, $request->new_password);
            
            return $this->successResponse(null, 'Password berhasil direset. Silakan login dengan password baru.');
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode() ?: 404);
        }
    }
}