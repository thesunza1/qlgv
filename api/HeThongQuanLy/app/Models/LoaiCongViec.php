<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoaiCongViec extends Model
{
    use HasFactory;
    protected $table = 'loaicongviec';
    protected $primaryKey = 'lcv_id';
    public $timestamps = false;
    
    protected $fillable = [
        'lcv_ten'
       
    ];
  
    public function baoCaoHangNgay()
    {
        return $this->hasMany(BaoCaoHangNgay::class, 'lcv_id', 'lcv_id');
    }
    public function congViecs()
    {
        return $this->hasMany(CongViec::class, 'lcv_id', 'lcv_id');
    }
    
}
