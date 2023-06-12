<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NhanVien;
use App\Models\KeHoach;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use Hash;
use Illuminate\Support\Facades\Validator;
class NhanVienController extends Controller
{
    private $user;

    public function __construct(NhanVien $user){
        $this->user = $user;
    }
    

    //Đăng nhập
    public function SignIn(Request $request)
    {
        $credentials = $request->only('nv_taikhoan', 'nv_matkhau');
        $token = null;

        try {
            $user = NhanVien::where('nv_taikhoan', $credentials['nv_taikhoan'])->first();

            if (!$user) {
                return response()->json(['invalid_email_or_password'], 422);
            }

            if ($credentials['nv_matkhau'] !== $user->nv_matkhau) {
                return response()->json(['invalid_email_or_password'], 422);
            }

            $token = JWTAuth::fromUser($user);
        } catch (JWTException $e) {
            return response()->json(['failed_to_create_token'], 500);
        }

        return response()->json(['message' => 'Login successful', 'token' => $token]);

    }


    //Đăng xuất 
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }


    ///Lấy thông tin người dùng dang dang nhap
    public function getUserInfo(Request $request){
        $user = JWTAuth::toUser($request->token);
        $user->load('donVi');
        return response()->json(['result' => $user]);
    }


    ///Lấy danh sách nhân viên 
    public function getNhanVien()
    {
        $nhanViens = NhanVien::all(); // Lấy tất cả bản ghi từ bảng NhanVien
        $soLuongNhanVien = $nhanViens->count(); // Đếm số lượng nhân viên
    
        return response()->json([
            'so_luong_nhan_vien' => $soLuongNhanVien,
            'nhanViens' => $nhanViens
        ]);
    }

    
   

}
