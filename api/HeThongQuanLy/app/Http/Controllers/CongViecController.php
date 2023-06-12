<?php

namespace App\Http\Controllers;
use App\Models\NhanVien;
use App\Models\KeHoach;
use App\Models\DonVi;
use App\Models\CongViec;
use App\Models\XinGiaHan;
use Illuminate\Http\Request;

class CongViecController extends Controller
{
    public function getCongViec(Request $request)
    {   
        $user = auth()->user();
        // Lấy giá trị các tham số từ request
     
        if (!$user) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập'], 401);
        }
    
        try {  
             $userId = $user->nv_id;
            // Lấy danh sách công việc dựa trên các tham số CV_ID và CV_CVCha của người dùng đang đăng nhập
            $danhSachCongViec = CongViec::where('nv_id', $userId)
                                        ->get();
    
            // Trả về dữ liệu JSON
            return response()->json($danhSachCongViec);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi lấy danh sách công việc: ' . $e->getMessage()], 500);
        }
    }

    public function get_CV_Thang($thang)
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
            $queryKeHoach = KeHoach::query();
            $queryCongViec = CongViec::query();

            if ($chucVuNhanVien === 'ld' && $quyenThamDinh == 1) {
                // Hiển thị toàn bộ bảng kế hoạch và danh sách công việc của giám đốc
                $keHoachs = $queryKeHoach->get();
                $congViecs = $queryCongViec->whereMonth('CV_THGIANBATDAU', $thang)->get();
            } elseif ($chucVuNhanVien === 'nv' && $quyenThamDinh == 1) {
                // Hiển thị kế hoạch trừ kế hoạch của giám đốc và hiển thị hết công việc trừ công việc của giám đốc
                $keHoachs = $queryKeHoach->whereHas('nhanVien', function ($query) {
                    $query->where('nv_quyen', '!=', 'ld');
                })->get();
                $congViecs = $queryCongViec->whereHas('nhanVien', function ($query) {
                    $query->where('nv_quyen', '!=', 'ld');
                })->whereMonth('CV_THGIANBATDAU', $thang)->get();
            } elseif ($chucVuNhanVien === 'nv' && $quyenThamDinh == 0) {
                // Hiển thị công việc của chính nhân viên đó
                $congViecs = $queryCongViec->where('nv_id', $userId)->whereMonth('CV_THGIANBATDAU', $thang)->get();
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

    public function themCongViec(Request $request, $kh_id)
    {
        // Lấy thông tin kế hoạch từ ID
        $keHoach = KeHoach::find($kh_id);
        
        if (!$keHoach) {
            return response()->json(['message' => 'Không tìm thấy kế hoạch'], 404);
        }
        
        // Tạo công việc mới
        $congViec = new CongViec();
        $congViec->kh_id = $keHoach->kh_id;
        $congViec->cv_ten = $request->input('cv_ten');
        $congViec->cv_thgianbatdau = $request->input('cv_thgianbatdau');
        $congViec->cv_thgianhoanthanh = $request->input('cv_thgianhoanthanh');
        $congViec->cv_tiendo = $request->input('cv_tiendo');
        $congViec->cv_trangthai = $request->input('cv_trangthai');
        $congViec->cv_noidung = $request->input('cv_noidung');
        $congViec->nv_id = auth()->user()->nv_id; // Lấy nv_id của người dùng hiện tại
        // ...Thêm các thuộc tính khác của công việc
        
        // Lưu công việc vào cơ sở dữ liệu
        $congViec->save();
        
        return response()->json(['message' => 'Thêm công việc thành công'], 200);
    }

    public function duyetcongviec(Request $request, $cv_ids)
    {
        $selectedIds = explode(',', $cv_ids); // Chuyển đổi chuỗi thành mảng các ID công việc đã chọn
    
        foreach ($selectedIds as $cv_id) {
            $congViec = CongViec::find($cv_id);
    
            if (!$congViec) {
                return response()->json(['message' => 'Không tìm thấy công việc'], 404);
            }
    
            // Kiểm tra quyền thẩm định của người dùng
            $user = auth()->user();
            if ($user && $user->nv_quyenthamdinh === "1") {
                // Duyệt công việc và cập nhật trạng thái
                $congViec->cv_trangthai = 1; // Đặt giá trị tương ứng với trạng thái "duyet"
                $congViec->save();
            }
        }
    
        return response()->json(['message' => 'Duyệt công việc thành công'], 200);
    }

    public function dsCongViecXinGiaHan()
    {
        $congViecGiaHan = CongViec::whereHas('xinGiaHans')->with('xinGiaHans.nhanVien', 'xinGiaHans.nhanVienDuyet')->get();

        $danhSachCongViec = [];

        foreach ($congViecGiaHan as $congViec) {
            foreach ($congViec->xinGiaHans as $xinGiaHan) {
                $nv_id = $xinGiaHan->nhanVien->nv_ten;
                $cv_id = $congViec->cv_ten;
                $nv_idduyet = $xinGiaHan->nhanVienDuyet->nv_ten;
                $lido = $xinGiaHan->hg_lido;
                $thgiandenghi = $xinGiaHan->hg_thgiandenghi;
                
                $danhSachCongViec[] = [
                    'nv_id' => $nv_id,
                    'cv_id' => $cv_id,
                    'lido' => $lido,
                    'thgiandenghi' =>  $thgiandenghi,
                    'nv_idduyet' => $nv_idduyet
                ];
            }
        }

        return response()->json(['danh_sach_cong_viec_xingiahan' => $danhSachCongViec], 200);
    }

    public function duyetdsCongViecXinGiaHan(Request $request, $hg_id)
    {
        $xinGiaHan = XinGiaHan::find($hg_id);
        $nhanVienDuyet = NhanVien::find(auth()->user()->nv_id);

        if (!$xinGiaHan) {
            return response()->json(['message' => 'Xin gia hạn không tồn tại'], 404);
        }

        // Thực hiện các thao tác duyệt và cập nhật thông tin người duyệt
        $xinGiaHan->hg_trangthai = '1';
        $xinGiaHan->nv_idduyet = $nhanVienDuyet->nv_id;
        $xinGiaHan->save();

        return response()->json(['message' => 'Duyệt xin gia hạn thành công'], 200);
    }

    public function xuLyCongViec($cvId, $action)
    {
        $selectedIds = explode(',', $cvId); 
        $user = auth()->user();

        foreach ($selectedIds as $cv_id) {
            $congViec = CongViec::find($cv_id);
            if (!$congViec) {
                return response()->json(['message' => 'Không tìm thấy công việc'], 404);
            }

            if ($cv_id == $cvId) {
                // Kiểm tra quyền thẩm định của người dùng
                $user = auth()->user();
                if ($user && $user->nv_quyenthamdinh === "1") {
                    if ($action === 1) {
                        // Xóa công việc
                        $congViec->delete();
                    } elseif ($action === 2) {
                        // Duyệt công việc
                        $congViec->cv_trangthai = 1;
                        $congViec->save();
                    }
                } else {
                    return response()->json(['message' => 'Bạn không có quyền xử lý công việc'], 403);
                }
            }
        }

        return response()->json(['message' => 'Xử lý công việc thành công'], 200);
    }

    public function xoaCongViec(Request $request)
    {
        $selectedIds = $request->input('delletecv_ids'); // Lấy danh sách ID công việc đã chọn từ request

        foreach ($selectedIds as $cv_id) {
            $congViec = CongViec::find($cv_id);

            if (!$congViec) {
                return response()->json(['message' => 'Không tìm thấy công việc'], 404);
            }

            // Xóa công việc
            $congViec->delete();
        }

        return response()->json(['message' => 'Đã xóa công việc thành công'], 200);
    }


}
