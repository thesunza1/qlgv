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
        'cv_trangthai',
        'cv_thgianbatdau',
        'cv_thgianhoanthanh',
        'cv_tiendo',
        'cv_noidung',
        'cv_cv_cha',
        'cv_trongso',
        'dv_id',
        'kh_id',
        'da_id',
        'n_cv_id',
        'nv_id',
        'cv_hanhoanthanh',
        'cv_tgthuchien',
        'nv_id_lam',
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
        return $this->belongsTo(DonVi::class, 'dv_id', 'dv_id');
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
        return $this->belongsTo(NhomCongViec::class, 'n_cv_id', 'n_cv_id');
    }

    public function duAns()
    {
        return $this->belongsTo(DuAn::class, 'da_id', 'da_id');
    }

    public function cv_cv_cha()
    {
        return $this->belongsTo(CongViec::class, 'cv_cv_cha', 'cv_id');
    }

    public function loaiCongViecs()
    {
        return $this->belongsTo(LoaiCongViec::class, 'lcv_id', 'lcv_id');
    }
    public function nhanVienLam()
    {
        return $this->belongsTo(NhanVien::class, 'nv_id_lam', 'nv_id');
    }


}
