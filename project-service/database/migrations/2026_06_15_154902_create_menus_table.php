<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            
         
            $table->unsignedBigInteger('user_id'); 
            
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2); 
            $table->string('image_url')->nullable(); 
            $table->timestamps();
        });
    }
};
