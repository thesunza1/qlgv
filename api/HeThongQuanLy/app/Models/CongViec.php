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
<<<<<<< HEAD
        'cv_trangthai'
=======
>>>>>>> b31fa8fe2001388e4e94c86a7ca70858da7023fa
    
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
<<<<<<< HEAD

    public function xinGiaHans()
    {
        return $this->hasMany(XinGiaHan::class, 'cv_id', 'cv_id');
    }
    
    public function nhomCongViecs()
    {
        return $this->belongsTo(XinGiaHan::class, 'n_cv_id', 'n_cv_id');
    }
=======
>>>>>>> b31fa8fe2001388e4e94c86a7ca70858da7023fa
}
