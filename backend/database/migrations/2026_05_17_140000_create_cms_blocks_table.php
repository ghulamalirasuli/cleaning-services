<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cms_blocks', function (Blueprint $table) {
            $table->id();
            $table->string('page', 32);
            $table->string('section_key', 64);
            $table->unsignedInteger('sort_order')->default(0);
            $table->text('title_en')->nullable();
            $table->text('title_de')->nullable();
            $table->text('body_en')->nullable();
            $table->text('body_de')->nullable();
            $table->string('icon', 64)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['page', 'section_key']);
            $table->index(['page', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cms_blocks');
    }
};
