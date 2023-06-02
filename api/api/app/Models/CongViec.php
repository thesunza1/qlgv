<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongViec extends Model
{
    use HasFactory;
    protected $table = 'congviec';
    protected $primaryKey = 'cv_id';
  
    public function nhanVien()
    {
        return $this->belongsTo(NhanVien::class, 'nv_id', 'nv_id');
    }

    public function keHoachs()
    {
        return $this->belongsTo(KeHoach::class, 'kh_id', 'kh_id');
    }

    public function donVi()
    {
        return $this->belongsTo(KeHoach::class, 'dv_id', 'dv_id');
    }
}
