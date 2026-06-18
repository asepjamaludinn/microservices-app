<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException; 

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'jwt.role' => \App\Http\Middleware\JwtRoleMiddleware::class,
        ]);
    })
   ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*')
        );

        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                $statusCode = 500;
                $message = $e->getMessage() ?: 'Terjadi kesalahan pada server.';

                if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                    $statusCode = 404;
                    $message = 'Data tidak ditemukan.';
                } elseif ($e instanceof AccessDeniedHttpException || $e instanceof AuthorizationException) { // Catch AuthorizationException di sini
                    $statusCode = 403;
                    $message = $e->getMessage() ?: 'Akses ditolak.';
                } elseif ($e instanceof ValidationException) {
                    return response()->json([
                        'status' => 'Error',
                        'message' => 'Validasi gagal.',
                        'errors' => $e->errors()
                    ], 422);
                } else {
                    $statusCode = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 400;
                }

                return response()->json([
                    'status' => 'Error',
                    'message' => $message,
                    'data' => null
                ], $statusCode);
            }
        });
    })->create();