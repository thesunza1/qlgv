<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Phong extends Model
{
    use HasFactory;

    protected $table = 'phong';
    protected $fillable = ['id', 'ten', 'id_donvi'];

    public function donvi()
    {
        return $this->belongsTo(DonVi::class, 'id_donvi', 'id');
    }

    public function nhanviens()
    {
        return $this->hasMany(NhanVien::class, 'id_phong', 'id');
    }
}