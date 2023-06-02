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
        Schema::create('congviec', function (Blueprint $table) {
            $table->bigIncrements('ID');
            $table->string('TEN', 50)->nullable();
            $table->date('THGIANBATDAU')->nullable();
            $table->date('THGIANHOANTHANH')->nullable();
            $table->integer('TIENDO')->nullable();
            $table->integer('CVCHA')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('congviec');
    }
};
