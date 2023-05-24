<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NhanVien extends Model
{
    use HasFactory;

    protected $table = 'nhanvien';
    protected $fillable = ['id', 'stt', 'ten', 'quyen', 'tentaikhoan', 'matkhau', 'id_donvi', 'id_phong'];
    public function donvi()
    {
        return $this->belongsTo(DonVi::class, 'id_donvi', 'id');
    }
    public function phong()
    {
        return $this->belongsTo(Phong::class, 'id_phong', 'id');
    }
}
