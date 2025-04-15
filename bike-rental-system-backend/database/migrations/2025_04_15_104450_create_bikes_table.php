<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bikes', function (Blueprint $table) {
            $table->id();
            $table->string('model');
            $table->string('brand');
            $table->string('type');
            $table->enum('status', ['available', 'rented', 'maintenance', 'damaged'])->default('available');
            $table->date('last_maintenance_date')->nullable();
            $table->decimal('hourly_rate', 8, 2);
            $table->decimal('daily_rate', 8, 2);
            $table->json('images')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bikes');
    }
};