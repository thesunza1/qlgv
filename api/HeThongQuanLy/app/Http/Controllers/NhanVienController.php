<?php
<<<<<<< HEAD

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\NhanVien;
class NhanVienController extends Controller
{
   public function index()
    {
        $nhanViens = NhanVien::all();
        return response()->json($nhanViens);
    }
    
}
=======
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
    
            if (!Hash::check($credentials['nv_matkhau'], $user->nv_matkhau)) {
                return response()->json(['invalid_email_or_password'], 422);
            }
    
            $token = JWTAuth::fromUser($user);
        } catch (JWTException $e) {
            return response()->json(['failed_to_create_token'], 500);
        }
    
        return response()->json(['message' => 'Login successful', 'token' => $token]);
    }

    public function add_nhanvien(Request $request)
    {
        $nhanViens = new NhanVien;
        $nhanViens->nv_ten = $request->input('nv_ten');
        $nhanViens->nv_stt = $request->input('nv_stt');
        $nhanViens->nv_quyen = $request->input('nv_quyen');
        $nhanViens->nv_taikhoan = $request->input('nv_taikhoan');
        $nhanViens->nv_matkhau = Hash::make($request->input('nv_matkhau'));
        $nhanViens->nv_quyenthamdinh = $request->input('nv_quyenthamdinh');
        $nhanViens->nv_sdt = $request->input('nv_sdt');
        $nhanViens->nv_diachi = $request->input('nv_diachi');
        $nhanViens->dv_id = $request->input('dv_id');
        
        // Tìm giá trị lớn nhất hiện tại của nv_id
        $maxNvId = NhanVien::max('nv_id');
        // Tăng giá trị lên 1 để tạo nv_id mới
        $nhanViens->nv_id = $maxNvId + 1;
        
        $nhanViens->save();
    
        return response()->json($nhanViens, 201);
    }

    public function update_nhanvien(Request $request, $id)
    {
        $nhanVien = NhanVien::find($id);

        if (!$nhanVien) {
            return response()->json(['message' => 'Nhân viên không tồn tại'], 404);
        }

        $nhanVien->nv_ten = $request->input('nv_ten');
        $nhanVien->nv_stt = $request->input('nv_stt');
        $nhanVien->nv_quyen = $request->input('nv_quyen');
        $nhanVien->nv_taikhoan = $request->input('nv_taikhoan');
        $nhanVien->nv_matkhau = Hash::make($request->input('nv_matkhau'));
        $nhanVien->nv_quyenthamdinh = $request->input('nv_quyenthamdinh');
        $nhanVien->nv_sdt = $request->input('nv_sdt');
        $nhanVien->nv_diachi = $request->input('nv_diachi');
        $nhanVien->dv_id = $request->input('dv_id');

        $nhanVien->save();

        return response()->json($nhanVien, 200);
    }

    public function delete_nhanvien($id)
    {
        $nhanVien = NhanVien::find($id);

        if (!$nhanVien) {
            return response()->json(['message' => 'Nhân viên không tồn tại'], 404);
        }

        $nhanVien->delete();

        return response()->json(['message' => 'Xóa nhân viên thành công'], 200);
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
>>>>>>> dev
