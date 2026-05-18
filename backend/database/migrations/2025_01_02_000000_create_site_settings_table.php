<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('app_name');
            $table->string('app_name_de')->nullable();
            $table->string('tagline')->nullable();
            $table->string('tagline_de')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('legal_name')->nullable();
            $table->string('contact_email');
            $table->string('contact_phone')->nullable();
            $table->text('contact_address')->nullable();
            $table->text('support_intro')->nullable();
            $table->text('support_intro_de')->nullable();
            $table->string('support_hours_phone')->nullable();
            $table->string('support_hours_email')->nullable();
            $table->string('support_hours_chat')->nullable();
            $table->string('support_chat_label')->nullable();
            $table->string('support_chat_label_de')->nullable();
            $table->string('country_code', 5)->default('DE');
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
