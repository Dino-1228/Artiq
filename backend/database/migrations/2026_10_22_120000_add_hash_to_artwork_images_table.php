<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('artwork_images', function (Blueprint $table) {
            $table->string('hash', 64)->nullable()->after('path');
            $table->index(['artwork_id', 'hash']);
        });
    }

    public function down(): void
    {
        Schema::table('artwork_images', function (Blueprint $table) {
            $table->dropIndex(['artwork_id', 'hash']);
            $table->dropColumn('hash');
        });
    }
};
