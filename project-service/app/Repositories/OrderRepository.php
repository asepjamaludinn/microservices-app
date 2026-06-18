<?php
namespace App\Repositories;

use App\Models\Order;

class OrderRepository
{
    public function getAllPaginated(array $filters)
    {
        $query = Order::with(['items.menu', 'table'])->orderBy('created_at', 'desc');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('customer_name', 'like', '%' . $search . '%')
                  ->orWhere('id', 'like', '%' . $search . '%');
            });
        }

        if (isset($filters['paginate']) && $filters['paginate'] === 'false') {
            return $query->get();
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function getUserOrders($userId, $perPage = 10)
    {
        return Order::with(['items.menu', 'table'])
                    ->where('user_id', $userId)
                    ->orderBy('created_at', 'desc')
                    ->paginate($perPage);
    }

    public function findById($id, $with = [])
    {
        return Order::with($with)->findOrFail($id);
    }

    public function create(array $data)
    {
        return Order::create($data);
    }

    public function createItems(Order $order, array $items)
    {
        return $order->items()->createMany($items);
    }

    public function update(Order $order, array $data)
    {
        $order->update($data);
        return $order;
    }
}