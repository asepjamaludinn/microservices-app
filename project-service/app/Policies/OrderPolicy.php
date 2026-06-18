<?php

namespace App\Policies;

use App\Models\Order;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Access\Response;

class OrderPolicy
{
 
    public function view(Authenticatable $user, Order $order): Response
    {
        if ($user->role === 'admin') {
            return Response::allow();
        }

        return (string) $user->id === (string) $order->user_id
            ? Response::allow()
            : Response::deny('Anda tidak memiliki akses ke pesanan ini.');
    }

    public function review(Authenticatable $user, Order $order): Response
    {
        return (string) $user->id === (string) $order->user_id
            ? Response::allow()
            : Response::deny('Anda tidak diizinkan mengulas pesanan orang lain.');
    }

    public function update(Authenticatable $user, Order $order): Response
    {
        return $user->role === 'admin'
            ? Response::allow()
            : Response::deny('Hanya admin yang dapat memanipulasi operasional pesanan.');
    }
}