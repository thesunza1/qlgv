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
        Schema::create('xingiahan', function (Blueprint $table) {
            $table->bigIncrements('ID');
            $table->string('LYDO', 100)->nullable();
            $table->date('THGIANDENGHI')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('xingiahan');
    }
};
