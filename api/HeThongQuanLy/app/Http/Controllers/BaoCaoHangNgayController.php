<?php

namespace App\Http\Controllers;
use App\Models\NhanVien;
use App\Models\BaoCaoHangNgay;
use App\Models\DonVi;
use App\Models\CongViec;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BaoCaoHangNgayController extends Controller
{
    public function update_TienDoBaoCaoHangNgay(Request $request)
    {
        $danhSachCongViec = $request->input('danh_sach_cong_viec_bao_cao');
    
        foreach ($danhSachCongViec as $congViecData) {
            $bchn_id = $congViecData['bchn_id'];
            $baoCao = BaoCaoHangNgay::find($bchn_id);
    
            if (!$baoCao) {
                return response()->json(['message' => 'Không tìm thấy báo cáo'], 404);
            }
    
            $bchn_trangthai = $congViecData['bchn_trangthai'];
    
            if ($bchn_trangthai == 1) {
                $congViec = $baoCao->congViecs;
                if ($baoCao->bchn_tiendo > $congViec->cv_tiendo) {
                    $congViec->cv_tiendo = $baoCao->bchn_tiendo;
                }
    
                if ($congViec->cv_tiendo == 100) {
                    if ($congViec->cv_hanhoanthanh > $baoCao->bchn_ngay) {
                        $congViec->cv_trangthai = 3; // Trạng thái đã hoàn thành
                    } else {
                        $congViec->cv_trangthai = 4; // Trạng thái đang thực hiện
                    }
                } else {
                    if ($congViec->cv_hanhoanthanh < $baoCao->bchn_ngay) {
                        $congViec->cv_trangthai = 4; // Trạng thái trễ hạn
                    } else {
                        $congViec->cv_trangthai = 2; // Trạng thái đang thực hiện
                    }
                }
    
                $baoCao->bchn_giothamdinh = $congViecData['bchn_giothamdinh'];
                $congViec->cv_thgianhoanthanh = $baoCao->bchn_tiendo == 100 ? $baoCao->bchn_ngay : null;
                $congViec->save();
            }
    
            $nguoiDuyet = auth()->user();
            $baoCao->nv_id_ngduyet = $nguoiDuyet->nv_id;
            $baoCao->bchn_trangthai = $bchn_trangthai;
            $baoCao->save();
            $tongGioThamDinh = DB::table('baocaohangngay')
            ->where('cv_id', $congViec->cv_id)
            ->sum('bchn_giothamdinh');

        DB::table('congviec')
            ->where('cv_id', $congViec->cv_id)
            ->update(['cv_tgthuchien' => $tongGioThamDinh]);
            $congViec->save();
        }
    
        return response()->json(['message' => 'Cập nhật báo cáo hàng ngày thành công'], 200);
    }
        
    public function add_CV_BC_HangNgay(Request $request)
{
    // Lấy thông tin người dùng đăng nhập
    $nguoiDung = auth()->user();
    
    // Lấy giá trị bắt đầu cho BCHN_ID
    $startId = BaoCaoHangNgay::max('bchn_id') + 1;

    // Lấy danh sách công việc báo cáo từ yêu cầu
    $danhSachCongViecBaoCao = $request->input('danh_sach_cong_viec_bao_cao');

    foreach ($danhSachCongViecBaoCao as $index => $congViecBaoCao) {
        // Tạo một báo cáo hàng ngày mới
        $baoCao = new BaoCaoHangNgay();

        // Lấy thông tin từ yêu cầu
        $baoCao->bchn_tiendo = $congViecBaoCao['bdhn_tiendo'];
        $baoCao->bchn_noidung = $congViecBaoCao['bchn_noidung'];
        $baoCao->so_gio_lam = $congViecBaoCao['so_gio_lam'];
        $baoCao->cv_id = $congViecBaoCao['cv_id'];
        // Chuyển đổi giờ bắt đầu thành định dạng 'H:i'
        $giobatdau = explode(':', $congViecBaoCao['bchn_giobatdau']);
        $giobatdau_formatted = str_pad($giobatdau[0], 2, '0', STR_PAD_LEFT) . ':' . str_pad($giobatdau[1], 2, '0', STR_PAD_LEFT);
        
        // Chuyển đổi giờ kết thúc thành định dạng 'H:i'
        $gioketthuc = explode(':', $congViecBaoCao['bchn_gioketthuc']);
        $gioketthuc_formatted = str_pad($gioketthuc[0], 2, '0', STR_PAD_LEFT) . ':' . str_pad($gioketthuc[1], 2, '0', STR_PAD_LEFT);
        
        $baoCao->bchn_giobatdau = $congViecBaoCao['bchn_giobatdau'];
        $baoCao->bchn_gioketthuc = $congViecBaoCao['bchn_gioketthuc'];
        

        // Tăng giá trị BCHN_ID theo chỉ số vòng lặp
        $baoCao->bchn_id = $startId + $index;

        // Lấy ngày hiện tại
        $ngayHienTai = date('Y-m-d') . ' ' . date('H:i:s');
        $baoCao->bchn_ngay = $ngayHienTai;
        
       

        // Lấy thông tin công việc từ yêu cầu
        $cv_id = $congViecBaoCao['cv_id'];
        $congViec = CongViec::where('cv_id', $cv_id)
                            ->where('nv_id_lam', $nguoiDung->nv_id)
                            ->first();

        if (!$congViec) {
            return response()->json(['message' => 'Không tìm thấy công việc hoặc bạn không có quyền truy cập công việc này'], 404);
        }
        $baoCao->congViecs()->associate($congViec);

        // Liên kết người dùng với báo cáo hàng ngày
        $baoCao->nv_id = $nguoiDung->nv_id;
        // Lưu báo cáo hàng ngày
        $baoCao->save();
    }

    return response()->json(['message' => 'Thêm công việc báo cáo hàng ngày thành công'], 200);
}

    public function get_CV_BC_HangNgay()
    {
        // Lấy danh sách các báo cáo hàng ngày kèm thông tin công việc, nhân viên, nhân viên người duyệt và loại công việc
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
            $chucVuNhanVien = $nhanVien->nv_quyen;
            $quyenThamDinh = $nhanVien->nv_quyenthamdinh;
            $baoCaos = BaoCaoHangNgay::query()->with('congViecs', 'nhanVien', 'nhanVienDuyet');

            if ($chucVuNhanVien === 'ld' && $quyenThamDinh == 1) {
                // Hiển thị toàn bộ bảng kế hoạch và danh sách công việc của giám đốc
                $baoCaos = $baoCaos->get();
            } elseif ($chucVuNhanVien === 'nv' && $quyenThamDinh == 1) {
                // Hiển thị kế hoạch trừ kế hoạch của giám đốc và hiển thị hết công việc trừ công việc của giám đốc
                $baoCaos = $baoCaos->whereHas('nhanVien', function ($query) {
                    $query->where('nv_quyen', '!=', 'ld');
                })->get();
            } elseif ($chucVuNhanVien === 'nv' && $quyenThamDinh == 0) {
                // Hiển thị công việc của chính nhân viên đó
                $baoCaos = $baoCaos->where('nv_id', $userId)->get();
            } else {
                // Xử lý trường hợp quyền không hợp lệ (nếu cần thiết)
                return response()->json(['message' => 'Quyền không hợp lệ'], 403);
            }

            // Kiểm tra nếu không có báo cáo nào
            if ($baoCaos->isEmpty()) {
                return response()->json(['message' => 'Không có báo cáo hàng ngày'], 404);
            }

            // Tạo một mảng chứa thông tin các báo cáo hàng ngày
            $baoCaoData = [];

            foreach ($baoCaos as $baoCao) {
                // Lấy thông tin công việc
                $congViec = $baoCao->congViecs;
                // Lấy thông tin nhân viên
                $nhanVien = $baoCao->nhanVien;
                // Lấy thông tin nhân viên người duyệt
                $nhanVienDuyet = $baoCao->nhanVienDuyet;
                // Lấy thông tin loại công việc

                // Tạo một mảng chứa thông tin của báo cáo hàng ngày
                $baoCaoItem = [
                    'bchn_id' => $baoCao->bchn_id,
                    'bchn_tiendo' => $baoCao->bchn_tiendo,
                    'bchn_trangthai' => $baoCao->bchn_trangthai,
                    'bchn_ngay' => date('d-m-Y H:i:s', strtotime($baoCao->bchn_ngay)),
                    'bchn_noidung' => $baoCao->bchn_noidung,
                    'so_gio_lam' => $baoCao->so_gio_lam,
                    'bchn_giobatdau' => $baoCao->bchn_giobatdau,
                    'bchn_gioketthuc' => $baoCao->bchn_gioketthuc,
                    'bchn_giothamdinh' => $baoCao->bchn_giothamdinh,
                    'cong_viec' => [
                        'ten_cong_viec' => $congViec->cv_ten,
                        // Thêm các thông tin khác của công việc cần lấy 
                    ],
                    'nhan_vien' => $nhanVien ? [
                        'ten_nhan_vien' => $nhanVien->nv_ten,
                        // Thêm các thông tin khác của nhân viên cần lấy
                    ] : null,
                    'ng_duyet' => $nhanVienDuyet ? [
                        'ten_nguoi_duyet' => $nhanVienDuyet->nv_ten,
                        // Thêm các thông tin khác của nhân viên người duyệt cần lấy
                    ] : null,
                ];

                // Thêm báo cáo hàng ngày vào mảng chứa thông tin
                $baoCaoData[] = $baoCaoItem;
            }

            // Trả về dữ liệu báo cáo hàng ngày
            return response()->json($baoCaoData, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Không tìm thấy nhân viên'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi lấy thông tin chức vụ nhân viên: ' . $e->getMessage()], 500);
        }
    }


        public function tongGioLamTrongThang(Request $request, $thang, $nam)
    {
        $nhanVienList = NhanVien::all();
        $result = [];

        foreach ($nhanVienList as $nhanVien) {
            $nvId = $nhanVien->nv_id;
            $tongGioLam = BaoCaoHangNgay::where('nv_id', $nvId)
                ->whereYear('bchn_ngay', $nam)
                ->whereMonth('bchn_ngay', $thang)
                ->whereNotNull('bchn_giothamdinh')
                ->where('bchn_giothamdinh', '>', 0) // Đảm bảo giá trị > 0
                ->sum('bchn_giothamdinh');

            $result[] = [
                'nhan_vien' => $nhanVien->toArray(),
                'tong_gio_lam' => $tongGioLam
            ];
        }

        return response()->json(['danh_sach_nhan_vien' => $result]);
    }

    public function delete_CV_BC_HangNgay(Request $request)
    {
        $selectedIds = $request->input('deletebchn_ids'); 
    
        foreach ($selectedIds as $bchn_id) {
            $baoCao = BaoCaoHangNgay::find($bchn_id);
    
            if (!$baoCao) {
                return response()->json(['message' => 'Không tìm thấy báo cáo'], 404);
            }
             $baoCao->delete();
             $congViec = $baoCao->congViecs;

             $congViec->cv_tiendo = BaoCaoHangNgay::where('cv_id', $congViec->cv_id)
                                                 ->where('bchn_trangthai', 1)
                                                 ->max('bchn_tiendo');
             $congViec->cv_tiendo = $congViec->cv_tiendo ?? 0;
             $tongGioThamDinh = DB::table('baocaohangngay')
                 ->where('cv_id', $congViec->cv_id)
                 ->sum('bchn_giothamdinh');
             
             DB::table('congviec')
                 ->where('cv_id', $congViec->cv_id)
                 ->update(['cv_tgthuchien' => $tongGioThamDinh]);
             
                 if ($congViec->cv_tiendo < 100) {
                    if ($congViec->cv_hanhoanthanh > $baoCao->bchn_ngay) {
                        $congViec->cv_thgianhoanthanh = null;
                        $congViec->cv_trangthai = 2; // Trạng thái đang thực hiện
                    } else {
                        $congViec->cv_thgianhoanthanh = null;
                        $congViec->cv_trangthai = 4; // Trạng thái trễ hạn
                    }
                } else {
                    $congViec->cv_thgianhoanthanh = $baoCao->bchn_ngay;
                    
                    if ($congViec->cv_hanhoanthanh < $baoCao->bchn_ngay) {
                        $congViec->cv_trangthai = 4; // Trạng thái trễ hạn
                    } else {
                        $congViec->cv_trangthai = 3; // Trạng thái đã hoàn thành
                    }
                }
                
                $congViec->save();
                
             
             $congViec->save();
             
            }
        return response()->json(['message' => 'Đã xóa báo cáo công việc thành công'], 200);
    }
    
    

}
