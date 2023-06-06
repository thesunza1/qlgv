<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BaoCaoHangNgay extends Model
{
    use HasFactory;
    protected $table = 'baocaohangngay';
    protected $primaryKey = 'bchn_id';
    public $timestamps = false;
    
    public function nhanVien()
    {
        return $this->belongsTo(NhanVien::class, 'nv_id', 'nv_id');
    }

    public function congViecs()
    {
        return $this->belongsTo(CongViec::class, 'cv_id', 'cv_id');
    }
  
}
