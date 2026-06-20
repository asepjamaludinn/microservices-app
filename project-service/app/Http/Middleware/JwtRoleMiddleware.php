<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Auth\GenericUser;
use Illuminate\Support\Facades\Auth;

class JwtRoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        try {
            $payload = JWTAuth::parseToken()->getPayload();
            $userId = $payload->get('sub');
            $userRole = $payload->get('role');
            $userName = $payload->get('name'); 

            $request->attributes->add([
                'auth_user_id' => $userId,
                'auth_user_role' => $userRole
            ]);

           
            $user = new GenericUser([
                'id' => $userId,
                'role' => $userRole,
                'name' => $userName,
            ]);
            Auth::setUser($user);

            if (!empty($roles) && !in_array($userRole, $roles)) {
                return response()->json([
                    'error' => 'Akses ditolak (403 Forbidden). Anda bukan ' . implode(' atau ', $roles)
                ], 403);
            }

        } catch (Exception $e) {
            return response()->json([
                'error' => 'Unauthorized (401). Token JWT tidak valid atau kadaluarsa.'
            ], 401);
        }

        return $next($request);
    }
}