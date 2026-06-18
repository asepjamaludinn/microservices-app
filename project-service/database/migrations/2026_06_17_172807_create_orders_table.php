<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); 
            $table->string('customer_name');
            $table->enum('order_type', ['dine_in', 'takeaway'])->default('dine_in'); 
            $table->unsignedBigInteger('table_id')->nullable();
            $table->foreign('table_id')->references('id')->on('tables')->nullOnDelete();
            
            $table->decimal('subtotal', 12, 2)->default(0); 
            $table->decimal('tax_amount', 12, 2)->default(0); 
            $table->decimal('total_amount', 12, 2)->default(0);
            
            $table->enum('status', ['pending', 'cooking', 'ready', 'completed', 'cancelled'])->default('pending');
            $table->string('payment_method')->default('cash'); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};