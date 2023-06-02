<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NhanVien;
use App\Models\KeHoach;
use App\Models\DonVi;
use App\Models\CongViec;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use Hash;
use Illuminate\Support\Facades\Validator;
class KeHoachController extends Controller
{
    // Lấy chức vụ của nhân viên đăng nhập
    public function get_KeHoach()
    {
        // Lấy thông tin người dùng đã xác thực từ token JWT
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập'], 401);
        }

        try {
            // Lấy thông tin nhân viên dựa trên user_id của người dùng đang đăng nhập
            $userId = $user->nv_id;
            $nhanVien = NhanVien::find($userId);

            // Kiểm tra nếu không tìm thấy nhân viên
            if (!$nhanVien) {
                return response()->json(['message' => 'Không tìm thấy nhân viên'], 404);
            }

            // Lấy chức vụ và tên của nhân viên đăng nhập
            $chucVuNhanVien = $nhanVien->nv_quyen;
            $tenNhanVien = $nhanVien->nv_ten;

            // Khởi tạo query để lấy danh sách kế hoạch
            $queryKeHoach = KeHoach::query();
            $queryCongViec = CongViec::query();

            if ($chucVuNhanVien === 'ld') {
                // Nếu là người dùng có quyền 'ld', hiển thị toàn bộ bảng kế hoạch và danh sách công việc
                // $keHoachs = $queryKeHoach->get();
                // $congViecs = $queryCongViec->get();
                $keHoachs = $queryKeHoach->where('nv_id', $userId)->get();
                $tongLuongKeHoach = $keHoachs->count();
                return response()->json([
                    'ten_nhan_vien' => $tenNhanVien,
                    'chuc_vu_nhan_vien' => $chucVuNhanVien,
                    'so_luong_ke_hoach' => $tongLuongKeHoach,
                    'ke_hoachs' => $keHoachs,
                ]);
            } elseif ($chucVuNhanVien === 'nv') {
                // Nếu là người dùng có quyền 'nv', hiển thị danh sách kế hoạch và công việc của cá nhân
                // $keHoachs = $queryKeHoach->where('nv_id', $userId)->get();
                $congViecs = $queryCongViec->where('nv_id', $userId)->get();
                $tongLuongCongViec = $congViecs->count();
                return response()->json([
                    'ten_nhan_vien' => $tenNhanVien,
                    'chuc_vu_nhan_vien' => $chucVuNhanVien,
                    'so_luong_cong_viec' => $tongLuongCongViec,
                    'cong_viecs' => $congViecs
                ]);
            } else {
                // Xử lý trường hợp quyền không hợp lệ (nếu cần thiết)
                return response()->json(['message' => 'Quyền không hợp lệ'], 403);
            }

            // Lấy tổng số lượng kế hoạch của nhân viên đăng nhập
            // $tongLuongKeHoach = $keHoachs->count();
            // $tongLuongCongViec = $congViecs->count();

            // return response()->json([
            //     'ten_nhan_vien' => $tenNhanVien,
            //     'chuc_vu_nhan_vien' => $chucVuNhanVien,
            //     'so_luong_ke_hoach' => $tongLuongKeHoach,
            //     'ke_hoachs' => $keHoachs,
            //     'so_luong_cong_viec' => $tongLuongCongViec,
            //     'cong_viecs' => $congViecs
            // ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Không tìm thấy nhân viên'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi lấy thông tin chức vụ nhân viên: ' . $e->getMessage()], 500);
        }
    }
}