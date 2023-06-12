<<<<<<< HEAD
<<<<<<< HEAD
<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
=======
<?php 
namespace App\Models;

>>>>>>> dev
=======
<?php 
namespace App\Models;

>>>>>>> b31fa8fe2001388e4e94c86a7ca70858da7023fa
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
<<<<<<< HEAD
<<<<<<< HEAD
=======
use Tymon\JWTAuth\Contracts\JWTSubject;
>>>>>>> b31fa8fe2001388e4e94c86a7ca70858da7023fa

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

<<<<<<< HEAD
=======
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

=======
>>>>>>> b31fa8fe2001388e4e94c86a7ca70858da7023fa
    protected $table = 'nhanvien';
    protected $primaryKey = 'nv_id';
    public $timestamps = false;


<<<<<<< HEAD
>>>>>>> dev
=======
>>>>>>> b31fa8fe2001388e4e94c86a7ca70858da7023fa
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
<<<<<<< HEAD
<<<<<<< HEAD
        'name',
        'email',
        'password',
=======
=======
>>>>>>> b31fa8fe2001388e4e94c86a7ca70858da7023fa
        'nv_ten',
        'nv_taikhoan',
        'nv_matkhau',
        'nv_quyen',
        'nv_quyenthamdinh',
<<<<<<< HEAD
>>>>>>> dev
=======
>>>>>>> b31fa8fe2001388e4e94c86a7ca70858da7023fa
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> b31fa8fe2001388e4e94c86a7ca70858da7023fa

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
<<<<<<< HEAD
>>>>>>> dev
=======
>>>>>>> b31fa8fe2001388e4e94c86a7ca70858da7023fa
}
