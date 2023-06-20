<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NhomCongViec extends Model
{
    use HasFactory;
    protected $table = 'nhomcongviec';
    protected $primaryKey = 'n_cv_id';
    public $timestamps = false;
    protected $fillable = [
        'n_cv_ten',
            ];
    // Các phần còn lại của model
    public function congViecs()
    {
        return $this->hasMany(CongViec::class, 'n_cv_id', 'n_cv_id');
    }
}