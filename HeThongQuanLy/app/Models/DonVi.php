<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonVi extends Model
{
    use HasFactory;

    protected $table = 'donvi';
    protected $fillable = ['id', 'stt', 'ten'];
    
    public function nhanviens()
    {
        return $this->hasMany(NhanVien::class, 'id_donvi', 'id');
    }

    public function phongs()
    {
        return $this->hasMany(Phong::class, 'id_donvi', 'id');
    }
}
