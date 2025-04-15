<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bike_id')->constrained()->onDelete('cascade');
            $table->enum('maintenance_type', ['routine', 'repair']);
            $table->text('description');
            $table->decimal('cost', 10, 2)->default(0);
            $table->date('scheduled_date');
            $table->date('completion_date')->nullable();
            $table->enum('status', ['scheduled', 'in-progress', 'completed'])->default('scheduled');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenance_records');
    }
};