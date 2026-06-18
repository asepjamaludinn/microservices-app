<?php

namespace App\Services;

use App\Repositories\OrderRepository;
use App\Repositories\MenuRepository;
use App\Repositories\TableRepository;
use App\Repositories\InventoryRepository;
use App\Repositories\AuditLogRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class OrderService
{
    protected $orderRepo;
    protected $menuRepo;
    protected $tableRepo;
    protected $inventoryRepo;
    protected $auditLogRepo;

    public function __construct(
        OrderRepository $orderRepo, 
        MenuRepository $menuRepo, 
        TableRepository $tableRepo, 
        InventoryRepository $inventoryRepo,
        AuditLogRepository $auditLogRepo
    ) {
        $this->orderRepo = $orderRepo;
        $this->menuRepo = $menuRepo;
        $this->tableRepo = $tableRepo;
        $this->inventoryRepo = $inventoryRepo;
        $this->auditLogRepo = $auditLogRepo;
    }

    public function getAllOrders(array $filters)
    {
        return $this->orderRepo->getAllPaginated($filters);
    }

    public function getUserOrders($userId, $perPage = 10)
    {
        return $this->orderRepo->getUserOrders($userId, $perPage);
    }

    public function createOrder(array $data, $authUserId)
    {
        return DB::transaction(function () use ($data, $authUserId) {
            $subtotal = 0;
            $orderItemsData = [];
            $deductedItems = []; 
            
            $tableId = $data['order_type'] === 'takeaway' ? null : ($data['table_id'] ?? null);
            
            if ($tableId) {
                $table = $this->tableRepo->findLockedById($tableId);
                if (in_array($table->status, ['in_use', 'reserved', 'maintenance'])) {
                    throw new \Exception("Meja {$table->table_number} sedang tidak tersedia ({$table->status}).");
                }
                $this->tableRepo->update($table, ['status' => 'in_use']);
            }

            foreach ($data['items'] as $item) {
                $menu = $this->menuRepo->findById($item['menu_id'], ['recipe.ingredients']);
                
                if (!$menu->is_available) {
                    throw new \Exception("Menu {$menu->name} sedang tidak tersedia.");
                }

                if ($menu->recipe) {
                    foreach ($menu->recipe->ingredients as $ingredient) {
                        $qtyToDeduct = $ingredient->pivot->quantity * $item['quantity'];
                        
                        $lockedIngredient = $this->inventoryRepo->findLockedById($ingredient->id);
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

            $order = $this->orderRepo->create([
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

            $this->orderRepo->createItems($order, $orderItemsData);

            $this->auditLogRepo->create([
                'user_id' => $authUserId,
                'action' => 'ORDER_CREATED',
                'entity_type' => 'Order',
                'entity_id' => $order->id,
                'details' => json_encode(['total_amount' => $totalAmount, 'table_id' => $tableId])
            ]);

            if (count($deductedItems) > 0) {
                $this->auditLogRepo->create([
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
            $order = $this->orderRepo->findById($id, ['items.menu.recipe.ingredients', 'table']);
            
            Gate::authorize('update', $order);

            $oldStatus = $order->status;
            
            if (in_array($newStatus, ['completed', 'cancelled'])) {
                if ($order->table_id && $order->table) {
                    $this->tableRepo->update($order->table, ['status' => 'available']);
                }
            }

            if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
                $refundedItems = [];
                foreach ($order->items as $item) {
                    if ($recipe = $item->menu->recipe) {
                        foreach ($recipe->ingredients as $ingredient) {
                            $qtyToRefund = $ingredient->pivot->quantity * $item->quantity;
                            $lockedIngredient = $this->inventoryRepo->findLockedById($ingredient->id);
                            
                            if ($lockedIngredient) {
                                $lockedIngredient->increment('stock', $qtyToRefund);
                                $refundedItems[] = "{$lockedIngredient->name} (+{$qtyToRefund})";
                            }
                        }
                    }
                }

                if ($order->payment_status === 'paid') {
                    $this->orderRepo->update($order, ['payment_status' => 'refunded']);
                }

                if (count($refundedItems) > 0) {
                    $this->auditLogRepo->create([
                        'user_id' => $authUserId,
                        'action' => 'STOCK_REFUNDED',
                        'entity_type' => 'Order',
                        'entity_id' => $order->id,
                        'details' => json_encode(['reason' => 'Order Cancelled', 'refunded' => $refundedItems])
                    ]);
                }
            }

            $this->orderRepo->update($order, ['status' => $newStatus]);

            $this->auditLogRepo->create([
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
            $order = $this->orderRepo->findById($id);
            
            Gate::authorize('update', $order);

            $oldPaymentStatus = $order->payment_status;

            if ($oldPaymentStatus === 'refunded') {
                throw new \Exception("Pesanan yang sudah di-refund tidak dapat diubah kembali.");
            }
            
            if ($oldPaymentStatus === 'paid' && $newPaymentStatus === 'unpaid') {
                throw new \Exception("Pesanan yang sudah dibayar tidak dapat dikembalikan menjadi belum dibayar.");
            }

            $this->orderRepo->update($order, ['payment_status' => $newPaymentStatus]);

            $this->auditLogRepo->create([
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