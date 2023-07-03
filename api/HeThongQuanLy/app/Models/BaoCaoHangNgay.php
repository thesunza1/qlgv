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
    protected $fillable = [
        'bchn_tiendo',
        'bchn_trangthai',
        'bchn_ngay',
        'cv_id',
        'bchn_noidung',
        'nv_id',
        'so_gio_lam',
        'nv_id_ngduyet',
        'bchn_giothamdinh',
        'bchn_giobatdau',
        'bchn_gioketthuc'
    ];
    public function nhanVien()
    {
        return $this->belongsTo(NhanVien::class, 'nv_id', 'nv_id');
    }

    public function congViecs()
    {
        return $this->belongsTo(CongViec::class, 'cv_id', 'cv_id');
    }

   
    public function nhanVienDuyet()
    {
        return $this->belongsTo(NhanVien::class, 'nv_id_ngduyet', 'nv_id');
    }
    public function congViecslam()
    {
        return $this->hasMany(CongViec::class, 'nv_id_lam', 'nv_id');
    }
  
}
