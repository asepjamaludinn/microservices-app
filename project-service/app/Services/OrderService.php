<?php

namespace App\Services;

use App\Models\Menu;
use App\Models\Order;
use App\Models\Table;
use App\Models\Ingredient;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function getAllOrders(array $filters)
    {
        $query = Order::with(['items.menu', 'table'])->orderBy('created_at', 'desc');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
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

    public function createOrder(array $data, $authUserId)
    {
        return DB::transaction(function () use ($data, $authUserId) {
            $subtotal = 0;
            $orderItemsData = [];
            $deductedItems = []; 
            
            $tableId = $data['order_type'] === 'takeaway' ? null : ($data['table_id'] ?? null);
            
            if ($tableId) {
                $table = Table::lockForUpdate()->findOrFail($tableId);
                if (in_array($table->status, ['in_use', 'reserved', 'maintenance'])) {
                    throw new \Exception("Meja {$table->table_number} sedang tidak tersedia ({$table->status}).");
                }
                $table->status = 'in_use';
                $table->save();
            }

            foreach ($data['items'] as $item) {
                $menu = Menu::with('recipe.ingredients')->findOrFail($item['menu_id']);
                
                if (!$menu->is_available) {
                    throw new \Exception("Menu {$menu->name} sedang tidak tersedia.");
                }

                if ($menu->recipe) {
                    foreach ($menu->recipe->ingredients as $ingredient) {
                        $qtyToDeduct = $ingredient->pivot->quantity * $item['quantity'];
                        
                        $lockedIngredient = Ingredient::lockForUpdate()->find($ingredient->id);
                        if (!$lockedIngredient || $lockedIngredient->stock < $qtyToDeduct) {
                            $itemName = $lockedIngredient ? $lockedIngredient->name : 'Bahan Tidak Diketahui';
                            throw new \Exception("Pesanan ditolak. Stok {$itemName} tidak mencukupi.");
                        }

                        $lockedIngredient->decrement('stock', $qtyToDeduct);
                        $deductedItems[] = "{$lockedIngredient->name} (-{$qtyToDeduct})";
                    }
                }

                $itemSubtotal = $menu->price * $item['quantity'];
                $subtotal += $itemSubtotal;

                $orderItemsData[] = [
                    'menu_id' => $menu->id,
                    'quantity' => $item['quantity'],
                    'price' => $menu->price, 
                    'subtotal' => $itemSubtotal,
                    'notes' => $item['notes'] ?? null,
                ];
            }

            $taxAmount = $subtotal * 0.11;
            $totalAmount = $subtotal + $taxAmount;

            $order = Order::create([
                'user_id' => $authUserId,
                'customer_name' => $data['customer_name'],
                'order_type' => $data['order_type'], 
                'table_id' => $tableId, 
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'payment_method' => $data['payment_method'],
                'status' => 'pending', 
                'payment_status' => 'unpaid' 
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            AuditLog::create([
                'user_id' => $authUserId,
                'action' => 'ORDER_CREATED',
                'entity_type' => 'Order',
                'entity_id' => $order->id,
                'details' => json_encode(['total_amount' => $totalAmount, 'table_id' => $tableId])
            ]);

            if (count($deductedItems) > 0) {
                AuditLog::create([
                    'user_id' => $authUserId,
                    'action' => 'STOCK_DEDUCTED',
                    'entity_type' => 'Order',
                    'entity_id' => $order->id,
                    'details' => json_encode(['reason' => 'Order Placed', 'deducted' => $deductedItems])
                ]);
            }

            return $order->load(['items.menu', 'table']);
        });
    }

    public function updateOrderStatus($id, $newStatus, $authUserId)
    {
        return DB::transaction(function () use ($id, $newStatus, $authUserId) {
            $order = Order::with(['items.menu.recipe.ingredients', 'table'])->findOrFail($id);
            $oldStatus = $order->status;
            
            if (in_array($newStatus, ['completed', 'cancelled'])) {
                if ($order->table_id && $order->table) {
                    $order->table->status = 'available';
                    $order->table->save();
                }
            }

            if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
                $refundedItems = [];
                foreach ($order->items as $item) {
                    if ($recipe = $item->menu->recipe) {
                        foreach ($recipe->ingredients as $ingredient) {
                            $qtyToRefund = $ingredient->pivot->quantity * $item->quantity;
                            $lockedIngredient = Ingredient::lockForUpdate()->find($ingredient->id);
                            if ($lockedIngredient) {
                                $lockedIngredient->increment('stock', $qtyToRefund);
                                $refundedItems[] = "{$lockedIngredient->name} (+{$qtyToRefund})";
                            }
                        }
                    }
                }

                if ($order->payment_status === 'paid') {
                    $order->payment_status = 'refunded';
                }

                if (count($refundedItems) > 0) {
                    AuditLog::create([
                        'user_id' => $authUserId,
                        'action' => 'STOCK_REFUNDED',
                        'entity_type' => 'Order',
                        'entity_id' => $order->id,
                        'details' => json_encode(['reason' => 'Order Cancelled', 'refunded' => $refundedItems])
                    ]);
                }
            }

            $order->status = $newStatus;
            $order->save();

            AuditLog::create([
                'user_id' => $authUserId,
                'action' => 'ORDER_STATUS_UPDATED',
                'entity_type' => 'Order',
                'entity_id' => $order->id,
                'details' => json_encode(['from' => $oldStatus, 'to' => $newStatus])
            ]);

            return $order;
        });
    }

    public function updatePaymentStatus($id, $newPaymentStatus, $authUserId)
    {
        return DB::transaction(function () use ($id, $newPaymentStatus, $authUserId) {
            $order = Order::findOrFail($id);
            $oldPaymentStatus = $order->payment_status;

            if ($oldPaymentStatus === 'refunded') {
                throw new \Exception("Pesanan yang sudah di-refund tidak dapat diubah kembali.");
            }
            if ($oldPaymentStatus === 'paid' && $newPaymentStatus === 'unpaid') {
                throw new \Exception("Pesanan yang sudah dibayar tidak dapat dikembalikan menjadi belum dibayar.");
            }

            $order->payment_status = $newPaymentStatus;
            $order->save();

            AuditLog::create([
                'user_id' => $authUserId,
                'action' => 'PAYMENT_STATUS_UPDATED',
                'entity_type' => 'Order',
                'entity_id' => $order->id,
                'details' => json_encode(['from' => $oldPaymentStatus, 'to' => $newPaymentStatus])
            ]);

            return $order;
        });
    }
}