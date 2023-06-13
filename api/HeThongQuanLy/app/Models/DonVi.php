<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonVi extends Model
{
    use HasFactory;
    protected $table = 'donvi';
    protected $primaryKey = 'dv_id';
    public $timestamps = false;
    protected $fillable = [
        'dv_ten',
        'dv_id_dvtruong',
        'dv_dvcha'
    ];
    // Các phần còn lại của model
    public function congViecs()
    {
        return $this->hasMany(CongViec::class, 'dv_id', 'dv_id');
    }

    public function dv_id_dvtruong()
    {
        return $this->belongsTo(NhanVien::class, 'dv_id_dvtruong', 'nv_id');
    }

    public function dv_dvcha()
    {
        return $this->belongsTo(DonVi::class, 'dv_dvcha', 'dv_id');
    }

    public function nhanViens()
    {
        return $this->hasMany(NhanVien::class, 'dv_id', 'dv_id');
    }
}