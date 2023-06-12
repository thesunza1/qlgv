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
<<<<<<< HEAD
    protected $fillable = [
        'bdhn_tiendo',
       
    ];
=======
    
>>>>>>> b31fa8fe2001388e4e94c86a7ca70858da7023fa
    public function nhanVien()
    {
        return $this->belongsTo(NhanVien::class, 'nv_id', 'nv_id');
    }

    public function congViecs()
    {
        return $this->belongsTo(CongViec::class, 'cv_id', 'cv_id');
    }
<<<<<<< HEAD

    public function loaiCongViecs()
    {
        return $this->belongsTo(LoaiCongViec::class, 'lcv_id', 'lcv_id');
    }
=======
>>>>>>> b31fa8fe2001388e4e94c86a7ca70858da7023fa
  
}
