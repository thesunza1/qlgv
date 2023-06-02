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
        Schema::create('nhanvien', function (Blueprint $table) {
            $table->bigIncrements('ID');
            $table->integer('STT')->nullable();
            $table->string('TEN', 50)->nullable();
            $table->integer('QUYEN')->nullable();
            $table->integer('QUYENTHAMDINH')->nullable();
            $table->string('TENTAIKHOAN', 50)->nullable();
            $table->string('MATKHAU', 50)->nullable();
            $table->unsignedBigInteger('ID_DONVI')->nullable();
            $table->unsignedBigInteger('ID_PHONG')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nhanvien');
    }
};
