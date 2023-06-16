<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DuAn extends Model
{
    use HasFactory;
    protected $table = 'duan';
    protected $primaryKey = 'da_id';
    public $timestamps = false;
    protected $fillable = [
        'da_ten',
        'da_mada'    ];
    // Các phần còn lại của model
    public function congViecs()
    {
        return $this->hasMany(CongViec::class, 'da_id', 'da_id');
    }
}