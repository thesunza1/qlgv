<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class NhanVien extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'nhanvien';
    protected $primaryKey = 'nv_id';
    public $timestamps = false;


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nv_ten',
        'nv_taikhoan',
        'nv_matkhau',
        'nv_quyen',
        'nv_quyenthamdinh',
    ];


    public function donVi()
    {
        return $this->belongsTo(DonVi::class, 'dv_id', 'dv_id');
    }


    public function keHoachs()
    {
        return $this->hasMany(KeHoach::class, 'nv_id', 'nv_id');
    }

    public function congViecs()
    {
        return $this->hasMany(CongViec::class, 'nv_id', 'nv_id');
    }
    public function congViecslam()
    {
        return $this->hasMany(CongViec::class, 'nv_id_lam', 'nv_id');
    }
    
    
    public function baoCaoHangNgay()
    {
        return $this->hasMany(BaoCaoHangNgay::class, 'nv_id', 'nv_id');
    }
    
    public function xinGiaHans()
    {
        return $this->hasMany(XinGiaHan::class, 'nv_id', 'nv_id');
    }
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'nv_matkhau',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}
