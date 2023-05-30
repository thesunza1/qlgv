<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KeHoach extends Model
{
    use HasFactory;
    protected $table = 'kehoach';
    protected $primaryKey = 'kh_id';
    protected $fillable = [
        'kh_ten',
        'kh_stt',
        'kh_loaikehoach',
        'kh_thgianbatdau',
        'kh_thgianketthuc',
        'kh_tongthgian',
    ];
    public function nhanVien(){

        return $this->belongsTo(NhanVien::class, 'nv_id', 'nv_id');
    }

    public function donVi(){

    return $this->belongsTo(DonVi::class, 'dv_id', 'dv_id');
    }
    
    public function congViecs()
    {
        return $this->hasMany(CongViec::class, 'cv_id', 'cv_id');
    }
}
