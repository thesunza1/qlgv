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
   
    public function get_CV_KeHoach()
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
            $quyenThamDinh = $nhanVien->nv_quyenthamdinh;
            $tenNhanVien = $nhanVien->nv_ten;

            // Khởi tạo query để lấy danh sách kế hoạch và công việc
            $queryKeHoach = KeHoach::query()->with('nhanVien', 'donVi');
            $queryCongViec = CongViec::query()->with('nhanVien', 'keHoachs', 'duAns', 'nhomCongViecs', 'donVi', 'cv_cv_cha');

            if ($chucVuNhanVien === 'ld' && $quyenThamDinh == 1) {
                // Hiển thị toàn bộ bảng kế hoạch và danh sách công việc của giám đốc
                $keHoachs = $queryKeHoach->get();
                $congViecs = $queryCongViec->get();
            } elseif ($chucVuNhanVien === 'nv' && $quyenThamDinh == 1) {
                // Hiển thị kế hoạch trừ kế hoạch của giám đốc và hiển thị hết công việc trừ công việc của giám đốc
                $keHoachs = $queryKeHoach->whereHas('nhanVien', function ($query) {
                    $query->where('nv_quyen', '!=', 'ld');
                })->get();
                $congViecs = $queryCongViec->whereHas('nhanVien', function ($query) {
                    $query->where('nv_quyen', '!=', 'ld');
                })->get();
            } elseif ($chucVuNhanVien === 'nv' && $quyenThamDinh == 0) {
                // Hiển thị công việc của chính nhân viên đó
                $congViecs = $queryCongViec->where('nv_id', $userId)->get();
                $keHoachs = null; // Không hiển thị kế hoạch cho nhân viên
            } else {
                // Xử lý trường hợp quyền không hợp lệ (nếu cần thiết)
                return response()->json(['message' => 'Quyền không hợp lệ'], 403);
            }

            // Lấy tổng số lượng kế hoạch và công việc
            $tongLuongKeHoach = isset($keHoachs) ? $keHoachs->count() : 0;
            $tongLuongCongViec = isset($congViecs) ? $congViecs->count() : 0;

            return response()->json([
                'ten_nhan_vien' => $tenNhanVien,
                'chuc_vu_nhan_vien' => $chucVuNhanVien,
                'quyen_tham_dinh' => $quyenThamDinh,
                'so_luong_ke_hoach' => $tongLuongKeHoach,
                'so_luong_cong_viec' => $tongLuongCongViec,
                'ke_hoachs' => $keHoachs,
                'cong_viecs' => $congViecs
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Không tìm thấy nhân viên'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi lấy thông tin chức vụ nhân viên: ' . $e->getMessage()], 500);
        }
    }


    public function create_KeHoach(Request $request)
    {
        // Kiểm tra và xác thực người dùng
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập'], 401);
        }

        // Lấy thông tin người dùng đăng nhập
        $userId = $user->nv_id;
        $nhanVien = NhanVien::find($userId);

        // Kiểm tra và xác thực thông tin người dùng
        if (!$nhanVien) {
            return response()->json(['message' => 'Không tìm thấy nhân viên'], 404);
        }

        // Kiểm tra và xác thực dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'kh_ten' => 'required',
            'kh_stt' => 'required',
            'kh_loaikehoach' => 'required',
            'kh_thgianbatdau' => 'required|date',
            'kh_thgianketthuc' => 'required|date',
            'kh_tongthgian' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            // Lấy giá trị kh_id lớn nhất hiện tại
            $maxKhId = KeHoach::max('kh_id');

            // Tạo kế hoạch mới
            $keHoach = new KeHoach();
            $keHoach->kh_id = $maxKhId + 1;
            $keHoach->kh_ten = $request->input('kh_ten');
            $keHoach->kh_stt = $request->input('kh_stt');
            $keHoach->kh_loaikehoach = $request->input('kh_loaikehoach');
            $keHoach->kh_thgianbatdau = $request->input('kh_thgianbatdau');
            $keHoach->kh_thgianketthuc = $request->input('kh_thgianketthuc');
            $keHoach->kh_tongthgian = $request->input('kh_tongthgian');
            $keHoach->nv_id = $nhanVien->nv_id;
            $keHoach->dv_id = $nhanVien->dv_id;
            $keHoach->save();
            
            return response()->json(['message' => 'Tạo kế hoạch thành công'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi tạo kế hoạch: ' . $e->getMessage()], 500);
        }
    }

    public function update_KeHoach(Request $request, $kh_id)
    {
        // Kiểm tra và xác thực người dùng
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập'], 401);
        }

        // Lấy thông tin người dùng đăng nhập
        $userId = $user->nv_id;
        $nhanVien = NhanVien::find($userId);

        // Kiểm tra và xác thực thông tin người dùng
        if (!$nhanVien) {
            return response()->json(['message' => 'Không tìm thấy nhân viên'], 404);
        }

        // Kiểm tra và xác thực dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'kh_ten' => 'required',
            'kh_stt' => 'required',
            'kh_loaikehoach' => 'required',
            'kh_thgianbatdau' => 'required|date',
            'kh_thgianketthuc' => 'required|date',
            'kh_tongthgian' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            // Tìm kế hoạch cần sửa
            $keHoach = KeHoach::find($kh_id);

            if (!$keHoach) {
                return response()->json(['message' => 'Không tìm thấy kế hoạch'], 404);
            }

            // Cập nhật thông tin kế hoạch
            $keHoach->kh_ten = $request->input('kh_ten');
            $keHoach->kh_stt = $request->input('kh_stt');
            $keHoach->kh_loaikehoach = $request->input('kh_loaikehoach');
            $keHoach->kh_thgianbatdau = $request->input('kh_thgianbatdau');
            $keHoach->kh_thgianketthuc = $request->input('kh_thgianketthuc');
            $keHoach->kh_tongthgian = $request->input('kh_tongthgian');
            $keHoach->nv_id = $nhanVien->nv_id;
            $keHoach->dv_id = $nhanVien->dv_id;
            $keHoach->save();

            return response()->json(['message' => 'Cập nhật kế hoạch thành công'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi cập nhật kế hoạch: ' . $e->getMessage()], 500);
        }
    }

    public function delete_KeHoach(Request $request)
    {
        try {
            $selectedIds = $request->input('delletekh_ids'); // Lấy danh sách ID kế hoạch đã chọn từ request

            foreach ($selectedIds as $kh_id) {
                $keHoach = KeHoach::find($kh_id);

                if (!$keHoach) {
                    return response()->json(['message' => 'Không tìm thấy kế hoạch có ID ' . $kh_id], 404);
                }

                // Xóa các công việc thuộc kế hoạch
                $congViecs = $keHoach->congViecs;
                foreach ($congViecs as $congViec) {
                    $congViec->delete();
                }

                // Xóa kế hoạch
                $keHoach->delete();
            }

            return response()->json(['message' => 'Xóa các kế hoạch và các công việc liên quan thành công'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi xóa kế hoạch: ' . $e->getMessage()], 500);
        }
    }
}