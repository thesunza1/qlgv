<?php

namespace App\Http\Controllers;
use App\Models\NhanVien;
use App\Models\BaoCaoHangNgay;
use App\Models\DonVi;
use App\Models\CongViec;
use App\Models\LoaiCongViec;
use Illuminate\Http\Request;

class BaoCaoHangNgayController extends Controller
{
    public function update_TienDoBaoCaoHangNgay(Request $request, $bchn_id)
    {
        $baoCao = BaoCaoHangNgay::find($bchn_id);

        if (!$baoCao) {
            return response()->json(['message' => 'Không tìm thấy báo cáo'], 404);
        }

        // Lấy thông tin trạng thái từ request
        $bchn_trangthai = $request->input('bchn_trangthai');

        if ($bchn_trangthai == 1) {
            // Cập nhật công việc
            $congViec = $baoCao->congViecs;
            
            $congViec->cv_tiendo = $baoCao->bchn_tiendo;

            // Kiểm tra xem tiến độ công việc đã đạt 100% chưa
            $congViec->cv_thgianhoanthanh = $baoCao->bchn_tiendo == 100 ? $baoCao->bchn_ngay : null;
            $congViec->save();
        }

        // Lấy thông tin người duyệt từ người đăng nhập
        $nguoiDuyet = auth()->user();
        $baoCao->nv_id_ngduyet = $nguoiDuyet->nv_id;
        
        if ($bchn_trangthai == 1) {
            // Cập nhật thông tin thẩm định
            $baoCao->bchn_giothamdinh = $baoCao->so_gio_lam;
        } elseif ($bchn_trangthai == 2) {
            // Không cập nhật cv_tiendo
        }

        // Cập nhật trạng thái báo cáo
        $baoCao->bchn_trangthai = $bchn_trangthai;
        $baoCao->save();

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
        $baoCao->lcv_id = $congViecBaoCao['lcv_id'];
        $baoCao->cv_id = $congViecBaoCao['cv_id'];
        
        // Tăng giá trị BCHN_ID theo chỉ số vòng lặp
        $baoCao->bchn_id = $startId + $index;

        // Lấy ngày hiện tại
        $ngayHienTai = date('Y-m-d');
        $baoCao->bchn_ngay = $ngayHienTai;

        // Lấy thông tin công việc từ yêu cầu
        $cv_id = $congViecBaoCao['cv_id'];
        $congViec = CongViec::where('cv_id', $cv_id)
                            ->where('nv_id', $nguoiDung->nv_id)
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
        $baoCaos = BaoCaoHangNgay::with('congViecs', 'nhanVien', 'nhanVienDuyet', 'loaiCongViecs')->get();
        
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
            $loaiCongViec = $baoCao->loaiCongViecs;
            
            // Tạo một mảng chứa thông tin của báo cáo hàng ngày
            $baoCaoItem = [
                'bchn_id' => $baoCao->bchn_id,
                'bchn_tiendo' => $baoCao->bchn_tiendo,
                'bchn_trangthai' => $baoCao->bchn_trangthai,
                'bchn_ngay' => date('d-m-Y', strtotime($baoCao->bchn_ngay)),
                'bchn_noidung' => $baoCao->bchn_noidung,
                'so_gio_lam' => $baoCao->so_gio_lam,
                'bchn_giothamdinh' => $baoCao->bchn_giothamdinh,
                'cong_viec' => [
                    'ten_cong_viec' => $congViec->cv_ten,
                    // Thêm các thông tin khác của công việc cần lấy 
                ],
                'loai_cong_viec' => [
                    'ten_loai_cong_viec' => $loaiCongViec->lcv_ten,
                    // Thêm các thông tin khác của loại công việc cần lấy
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
    }

}
