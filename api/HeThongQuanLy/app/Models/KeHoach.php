<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KeHoach extends Model
{
    use HasFactory;
    protected $table = 'kehoach';
    protected $primaryKey = 'kh_id';
    public $timestamps = false;
    
    protected $fillable = [
        'kh_ten',
       
    ];
    public function nhanVien(){

        return $this->belongsTo(NhanVien::class, 'nv_id', 'nv_id');
    }

    public function donVi(){

    return $this->belongsTo(DonVi::class, 'dv_id', 'dv_id');
    }
    
    public function congViecs()
    {
        return $this->hasMany(CongViec::class, 'kh_id', 'kh_id');
    }
    
}
