<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('service_extras', function (Blueprint $table) {
            $table->softDeletes();
            $table->boolean('is_active')->default(true)->after('requires_equipment');
        });

        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('hero_badge_en')->nullable()->after('tagline_de');
            $table->string('hero_badge_de')->nullable()->after('hero_badge_en');
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('author_name');
            $table->string('author_name_de')->nullable();
            $table->text('body');
            $table->text('body_de')->nullable();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');

        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn(['hero_badge_en', 'hero_badge_de']);
        });

        Schema::table('service_extras', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn('is_active');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
