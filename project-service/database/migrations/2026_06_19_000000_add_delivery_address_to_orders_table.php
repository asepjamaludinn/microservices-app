<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->text('delivery_address')->nullable()->after('table_id');
        });
        DB::statement("ALTER TABLE orders ALTER COLUMN order_type TYPE VARCHAR(20)");
        DB::statement("ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_type_check");
        DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_order_type_check CHECK (order_type IN ('dine_in', 'takeaway', 'online'))");
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('delivery_address');
        });

        DB::statement("ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_type_check");
        DB::statement("ALTER TABLE orders ALTER COLUMN order_type TYPE VARCHAR(20)");
        DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_order_type_check CHECK (order_type IN ('dine_in', 'takeaway'))");
    }
};