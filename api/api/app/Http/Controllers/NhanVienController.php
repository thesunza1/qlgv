<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NhanVien;
use App\Models\KeHoach;
use App\Models\DonVi;
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

    //lấy danh sách kế hoạch thuộc từng nhân viên
    public function getKeHoach(Request $request)
    {
        // Lấy thông tin người dùng đã xác thực từ token JWT
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập'], 401);
        }

        try {
            // Lấy thông tin nhân viên dựa trên user_id của người dùng đang đăng nhập
            $userId = $user->nv_id;
            $nhanVien = NhanVien::with(['keHoachs', 'congViecs'])->where('nv_id', $userId)->first();

            // Kiểm tra nếu không tìm thấy nhân viên
            if (!$nhanVien) {
                return response()->json(['message' => 'Không tìm thấy nhân viên'], 404);
            }

            // Tạo một mảng để lưu trữ kết quả
            $result = [
                'nhan_vien' => [
                    'nv_ten' => $nhanVien->nv_ten // Thêm trường tên nhân viên vào mảng
                ],
                'so_luong_ke_hoach' => $nhanVien->keHoachs->count(),
                'ke_hoachs' => $nhanVien->keHoachs,
                'so_luong_cong_viec' => $nhanVien->congViecs->count(),
                'cong_viecs' => $nhanVien->congViecs
            ];

            return response()->json($result);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Không tìm thấy nhân viên'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi lấy thông tin kế hoạch và công việc: ' . $e->getMessage()], 500);
        }
    }
    
   
    public function getKeHoachnv(Request $request)
    {
        // Lấy thông tin người dùng đã xác thực từ token JWT
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập'], 401);
        }

        try {
            // Lấy danh sách nhân viên
            $nhanViens = NhanVien::all();

            // Lấy danh sách kế hoạch của tất cả nhân viên
            $keHoachs = KeHoach::whereIn('nv_id', $nhanViens->pluck('nv_id'))->get();

            // Tạo một mảng để lưu trữ kết quả
            $result = [];

            foreach ($nhanViens as $nhanVien) {
                // Lọc danh sách kế hoạch của nhân viên hiện tại
                $nhanVienKeHoachs = $keHoachs->where('nv_id', $nhanVien->nv_id);
                $soLuongKeHoach = $nhanVienKeHoachs->count();

                $result[] = [
                    'nhan_vien' => [
                        'nv_ten' => $nhanVien->nv_ten // Thêm trường tên nhân viên vào mảng
                    ],
                    'so_luong_ke_hoach' => $soLuongKeHoach,
                    'ke_hoachs' => $nhanVienKeHoachs
                ];
            }

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi lấy thông tin kế hoạch: ' . $e->getMessage()], 500);
        }
    }
}
