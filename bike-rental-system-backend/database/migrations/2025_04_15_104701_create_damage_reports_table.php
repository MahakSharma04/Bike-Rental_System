<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('damage_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade');
            $table->foreignId('bike_id')->constrained()->onDelete('cascade');
            $table->foreignId('reported_by')->constrained('users')->onDelete('cascade');
            $table->text('description');
            $table->json('images')->nullable();
            $table->enum('severity', ['minor', 'moderate', 'severe']);
            $table->enum('status', ['reported', 'under review', 'repair scheduled', 'repaired'])->default('reported');
            $table->decimal('additional_charges', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('damage_reports');
    }
};