<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonVi extends Model
{
    use HasFactory;

    protected $table = 'donvi';
    protected $fillable = ['DV_ID', 'DV_TEN', 'DV_ID_DVTRUONG', 'DV_DVCHA'];
    
    public function nhanviens()
    {
        return $this->hasMany(NhanVien::class, 'DV_ID', 'id');
    }

    // public function phongs()
    // {
    //     return $this->hasMany(Phong::class, 'id_donvi', 'id');
    // }
}
