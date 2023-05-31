<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NhanVien extends Model
{
    use HasFactory;

    protected $table = 'nhanvien';
    protected $fillable = ['NV_ID', 'NV_STT', 'NV_TEN', 'NV_QUYEN', 'NV_TAIKHOAN', 'NV_MATKHAU', 'NV_QUYENTHAMDINH'];

    public function donvi()
    {
        return $this->belongsTo(DonVi::class, 'DV_ID', 'id');
    }
    
    // public function phong()
    // {
    //     return $this->belongsTo(Phong::class, 'id_phong', 'id');
    // }
}
