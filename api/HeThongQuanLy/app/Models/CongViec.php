<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongViec extends Model
{
    use HasFactory;
    protected $table = 'congviec';
    protected $primaryKey = 'cv_id';
    public $timestamps = false;
    
    protected $fillable = [
        'cv_ten',
        'cv_trangthai'
    
    ];
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

    public function baoCaoHangNgay()
    {
        return $this->hasMany(BaoCaoHangNgay::class, 'nv_id', 'id');
    }

    public function xinGiaHans()
    {
        return $this->hasMany(XinGiaHan::class, 'cv_id', 'cv_id');
    }
    
    public function nhomCongViecs()
    {
        return $this->belongsTo(XinGiaHan::class, 'n_cv_id', 'n_cv_id');
    }
}
