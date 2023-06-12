<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class XinGiaHan extends Model
{
    use HasFactory;
    protected $table = 'xingiahan';
    protected $primaryKey = 'hg_id';
    public $timestamps = false;
    
    protected $fillable = [
        'hg_lido',
        'hg_thgiandenghi',
        'nv_idduyet',
        'nv_id',
        'cv_id',
        'hg_trangthai',
    
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
        return $this->belongsTo(NhanVien::class, 'nv_idduyet', 'nv_id');
    }


}
