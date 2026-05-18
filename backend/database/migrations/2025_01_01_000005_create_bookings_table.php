<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('cleaner_id')->nullable()->constrained();
            $table->foreignId('service_id')->constrained();
            $table->foreignId('city_id')->constrained();
            $table->text('address');
            $table->dateTime('scheduled_at');
            $table->enum('frequency', ['once', 'weekly', 'biweekly', 'monthly'])->default('once');
            $table->decimal('estimated_hours', 4, 2);
            $table->decimal('deposit_amount', 8, 2);
            $table->decimal('total_amount', 8, 2)->nullable();
            $table->enum('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->boolean('english_speaker_requested')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
