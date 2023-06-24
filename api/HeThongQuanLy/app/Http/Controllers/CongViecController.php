<?php

namespace App\Http\Controllers;
use App\Models\NhanVien;
use App\Models\KeHoach;
use App\Models\DonVi;
use App\Models\CongViec;
use App\Models\XinGiaHan;
use App\Models\NhomCongViec;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Models\BaoCaoHangNgay;

class CongViecController extends Controller
{
    public function get_CongViec()
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
            $queryCongViec = CongViec::query()->with('nhanVien', 'keHoachs', 'duAns', 'nhomCongViecs', 'donVi', 'cv_cv_cha', 'loaiCongViecs');

            if ($chucVuNhanVien === 'ld' && $quyenThamDinh == 1) {
                // Hiển thị toàn bộ bảng kế hoạch và danh sách công việc của giám đốc
                $congViecs = $queryCongViec->get();
            } elseif ($chucVuNhanVien === 'nv' && $quyenThamDinh == 1) {
                // Hiển thị kế hoạch trừ kế hoạch của giám đốc và hiển thị hết công việc trừ công việc của giám đốc
                $congViecs = $queryCongViec->whereHas('nhanVien', function ($query) {
                    $query->where('nv_quyen', '!=', 'ld');
                })->get();
            } elseif ($chucVuNhanVien === 'nv' && $quyenThamDinh == 0) {
                // Hiển thị công việc của chính nhân viên đó
                $congViecs = $queryCongViec->where('nv_id', $userId)->get();
            } else {
                // Xử lý trường hợp quyền không hợp lệ (nếu cần thiết)
                return response()->json(['message' => 'Quyền không hợp lệ'], 403);
            }

            // Lấy tổng số lượng kế hoạch và công việc
            $tongLuongCongViec = isset($congViecs) ? $congViecs->count() : 0;
// Tạo một mảng chứa thông tin các công việc
             $congViecData = [];

foreach ($congViecs as $congViec) {
    // Lấy thông tin nhân viên
    $nhanVien = $congViec->nhanVien()->first();
    // Lấy thông tin kế hoạch
    $keHoach = $congViec->keHoachs()->first();
    // Lấy thông tin đơn vị
    $donVi = $congViec->donVi()->first();
    // Lấy thông tin nhóm công việc
    $nhomCongViec = $congViec->nhomCongViecs()->first();
    // Lấy thông tin dự án
    $duAn = $congViec->duAns()->first();
    // Lấy thông tin công việc cha
    $congViecCha = $congViec->cv_cv_cha()->first();
    // Lấy thông tin loại công việc
    $loaiCongViec = $congViec->loaiCongViecs()->first();

    // Tạo một mảng chứa thông tin của công việc
    $congViecItem = [
        'cv_id' => $congViec->cv_id,
        'cv_ten' => $congViec->cv_ten,
        'cv_trangthai' => $congViec->cv_trangthai,
        'cv_thgianbatdau' => $congViec->cv_thgianbatdau ? date('d-m-Y', strtotime($congViec->cv_thgianbatdau)) : null,
        'cv_thgianhoanthanh' => $congViec->cv_thgianhoanthanh ? date('d-m-Y', strtotime($congViec->cv_thgianhoanthanh)) : null,
        'cv_tiendo' => $congViec->cv_tiendo,
        'cv_noidung' => $congViec->cv_noidung,
        'cv_cv_cha' => $congViec->cv_cv_cha,
        'cv_trongso' => $congViec->cv_trongso,
        'dv_id' => $congViec->dv_id,
        'kh_id' => $congViec->kh_id,
        'da_id' => $congViec->da_id,
        'n_cv_id' => $congViec->n_cv_id,
        'nv_id' => $congViec->nv_id,
        'cv_hanhoanthanh' =>$congViec->cv_hanhoanthanh ? date('d-m-Y', strtotime($congViec->cv_hanhoanthanh)) : null,
        'cv_tgthuchien' => $congViec->cv_tgthuchien,
        'nhan_vien' => $nhanVien ? [
            'ten_nhan_vien' => $nhanVien->nv_ten,
            // Thêm các thông tin khác của nhân viên cần lấy
        ] : null,
        'ke_hoach' => $keHoach ? [
            'ten_ke_hoach' => $keHoach->kh_ten,
            // Thêm các thông tin khác của kế hoạch cần lấy
        ] : null,
        'don_vi' => $donVi ? [
            'ten_don_vi' => $donVi->dv_ten,
            // Thêm các thông tin khác của đơn vị cần lấy
        ] : null,
        'nhom_cong_viec' => $nhomCongViec ? [
            'ten_nhom_cong_viec' => $nhomCongViec->ncv_ten,
            // Thêm các thông tin khác của nhóm công việc cần lấy
        ] : null,
        'du_an' => $duAn ? [
            'ten_du_an' => $duAn->da_ten,
            // Thêm các thông tin khác của dự án cần lấy
        ] : null,
        'cong_viec_cha' => $congViecCha ? [
            'ten_cong_viec_cha' => $congViecCha->cv_ten,
            // Thêm các thông tin khác của công việc cha cần lấy
        ] : null,
        'loai_cong_viec' => $loaiCongViec ? [
            'ten_loai_cong_viec' => $loaiCongViec->lcv_ten,
            // Thêm các thông tin khác của loại công việc cần lấy
        ] : null,
    ];

    // Thêm công việc vào mảng chứa thông tin
    $congViecData[] = $congViecItem;
}

// Trả về dữ liệu công việc
return response()->json($congViecData, 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Không tìm thấy nhân viên'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi lấy thông tin chức vụ nhân viên: ' . $e->getMessage()], 500);
        }
    }

    public function add_CongViec(Request $request, $kh_id)
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
        $congViec->cv_trangthai = $request->input('cv_trangthai');
        $congViec->cv_noidung = $request->input('cv_noidung');
        $congViec->cv_cv_cha = $request->input('cv_cv_cha');
        $congViec->cv_trongso = $request->input('cv_trongso');
        $congViec->dv_id = $request->input('dv_id');
        $congViec->kh_id = $request->input('kh_id');
        $congViec->da_id = $request->input('da_id');
        $congViec->n_cv_id = $request->input('n_cv_id');
        $congViec->cv_hanhoanthanh = $request->input('cv_hanhoanthanh');
        $congViec->cv_tgthuchien = $request->input('cv_tgthuchien');
        $congViec->nv_id = auth()->user()->nv_id; // Lấy nv_id của người dùng hiện tại
        // ...Thêm các thuộc tính khác của công việc
        
        // Lưu công việc vào cơ sở dữ liệu
        $congViec->save();
        
        return response()->json(['message' => 'Thêm công việc thành công'], 200);
    }

    public function get_CV_DotXuat()
    {
        $kh_id = 1; // ID của kế hoạch đột xuất

        $congViec = CongViec::where('kh_id', $kh_id)->get();

        return response()->json($congViec, 200);
    }


    public function add_CV_DotXuat(Request $request)
    {
        $kh_id = $request->input('kh_id', 1); // Giá trị mặc định là 5 nếu không có giá trị kh_id trong request

        // Lấy thông tin kế hoạch từ ID
        $keHoach = KeHoach::find($kh_id);

        if (!$keHoach) {
            return response()->json(['message' => 'Không tìm thấy kế hoạch'], 404);
        }

        $congViecData = $request->input('cong_viec'); // Mảng chứa thông tin các công việc

        // Lưu các công việc
        foreach ($congViecData as $cvData) {
            // Tạo công việc mới
            $congViec = new CongViec();
            $congViec->kh_id = $keHoach->kh_id;
            $congViec->cv_ten = $cvData['cv_ten'];
            $congViec->cv_thgianbatdau = $cvData['cv_thgianbatdau'];
            $congViec->cv_trangthai = $cvData['cv_trangthai'];
            $congViec->cv_noidung = $cvData['cv_noidung'];
            $congViec->cv_cv_cha = $cvData['cv_cv_cha'];
            $congViec->cv_trongso = $cvData['cv_trongso'];
            $congViec->dv_id = $cvData['dv_id'];
            $congViec->kh_id = $kh_id;
            $congViec->da_id = $cvData['da_id'];
            $congViec->n_cv_id = $cvData['n_cv_id'];
            $congViec->cv_hanhoanthanh = $cvData['cv_hanhoanthanh'];
            $congViec->cv_tgthuchien = $cvData['cv_tgthuchien'];
            $congViec->nv_id = auth()->user()->nv_id; // Lấy nv_id của người dùng hiện tại
            // ...Thêm các thuộc tính khác của công việc

            // Lưu công việc vào cơ sở dữ liệu
            $congViec->save();
        }
        return response()->json(['message' => 'Thêm công việc đột xuất thành công'], 200);
    }


    public function duyet_CongViec(Request $request, $cv_ids)
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
                $congViec->cv_trangthai = 2; // Đặt giá trị tương ứng với trạng thái "duyet"
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
                $trangthai = $xinGiaHan->hg_trangthai;
                $danhSachCongViec[] = [
                    'nv_id' => $nv_id,
                    'cv_id' => $cv_id,
                    'lido' => $lido,
                    'thgiandenghi' =>  $thgiandenghi,
                    'trangthai' => $trangthai,
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
        $xinGiaHan->hg_trangthai = $request->input('hg_trangthai'); // Lấy giá trị từ request
        $xinGiaHan->nv_idduyet = $nhanVienDuyet->nv_id;
        $xinGiaHan->save();
    
        // Truy cập đối tượng congviec qua quan hệ đã thiết lập
        $congViec = $xinGiaHan->congViecs;
    
        if ($congViec && $xinGiaHan->hg_trangthai == 1) {
            // Cập nhật giá trị cv_hanhoanthanh bằng giá trị của hg_thgiandenghi
            $congViec->cv_hanhoanthanh = $xinGiaHan->hg_thgiandenghi;
            $congViec->save();
        }
        
    
        return response()->json(['message' => 'Cập nhật trạng thái gia hạn thành công'], 200);
    }

    public function xuly_CongViec(Request $request)
    {
        $selectedIds = $request->input('cv_ids');
        $action = $request->input('action');
        $user = auth()->user();
    
        foreach ($selectedIds as $cv_id) {
            $congViec = CongViec::find($cv_id);
            if (!$congViec) {
                return response()->json(['message' => 'Không tìm thấy công việc'], 404);
            }
    
            // Kiểm tra quyền thẩm định của người dùng
            $user = auth()->user();
            if ($user && $user->nv_quyenthamdinh === "1") {
                if ($action === 1) {
                    // Xóa công việc
                    $congViec->delete();
                } elseif ($action === 2) {
                    // Duyệt công việc
                    $congViec->cv_trangthai = 2;
                    $congViec->save();
                }
            } else {
                return response()->json(['message' => 'Bạn không có quyền xử lý công việc'], 403);
            }
        }
    
        return response()->json(['message' => 'Xử lý công việc thành công'], 200);
    }
    

    public function delete_CongViec(Request $request)
    {
        $selectedIds = $request->input('deletecv_ids'); // Lấy danh sách ID công việc đã chọn từ request

        foreach ($selectedIds as $cv_id) {
            $congViec = CongViec::find($cv_id);

            if (!$congViec) {
                return response()->json(['message' => 'Không tìm thấy công việc'], 404);
            }

            // Cập nhật các bản ghi trong bảng xin_gia_han có cv_id = $cv_id thành cv_id = null
            XinGiaHan::where('cv_id', $cv_id)->update(['cv_id' => null]);

            // Xóa công việc
            $congViec->delete();
        }

        return response()->json(['message' => 'Đã xóa công việc thành công'], 200);
    }

    public function test_TrangThaiCongViec(Request $request)
    {
        $congViecId = $request->input('congViecId');

        // Truy vấn thông tin công việc từ cơ sở dữ liệu dựa trên công việc ID
        $congViec = CongViec::find($congViecId);

        if (!$congViec) {
            return response()->json(['message' => 'Không tìm thấy công việc'], 404);
        }

        $thoiGianHoanThanh = $congViec->cv_thgianhoanthanh;
        $hanHoanThanh = $congViec->cv_hanhoanthanh;
        $tienDo = $congViec->cv_tiendo;

        // Kiểm tra trạng thái công việc dựa trên các thông tin
        $trangThai = '';

        if ($thoiGianHoanThanh > $hanHoanThanh && $tienDo < 100) {
            $trangThai = 'Quá hạn';
        } elseif ($thoiGianHoanThanh === $hanHoanThanh && $tienDo === 100) {
            $trangThai = 'Hoàn thành';
        } elseif (!$thoiGianHoanThanh && $tienDo < 100) {
            $trangThai = 'Đang thực hiện';
        }

        return response()->json([
            'Thời Gian Hoàn Thành' => $thoiGianHoanThanh,
            'Hạn Hoàn Thành' => $hanHoanThanh,
            'Tiến Độ' => $tienDo,
            'Trạng Thái' => $trangThai,
        ], 200);
    }
    function capnhatTGThucHienCV(Request $request, $cv_id)
    {
        // Tìm công việc theo ID
        $congViec = CongViec::find($cv_id);

        if ($congViec) {
            // Lấy tổng thời gian thực hiện từ bảng công việc
            $tongThoiGianThucHien = $congViec->cv_tgthuchien;

            // Lấy tổng thời gian thẩm định từ bảng báo cáo hàng ngày
            $baoCaoHangNgay = BaoCaoHangNgay::where('cv_id', $cv_id)->sum('bchn_giothamdinh');

            // Cập nhật tổng thời gian thực hiện công việc
            $congViec->cv_tgthuchien = $tongThoiGianThucHien + $baoCaoHangNgay;
            $congViec->save();

            // Tạo dữ liệu JSON
            $responseData = [
                'cv_tgthuchien' => $congViec->cv_tgthuchien,
                'message' => 'Cập nhật tổng thời gian thực hiện công việc thành công.'
            ];

            // Trả về response JSON
            return Response::json($responseData, 200);
        }

        // Trường hợp không tìm thấy công việc
        return Response::json(['message' => 'Không tìm thấy công việc.'], 404);
    }
    public function capNhatTrangThaiCongViec(Request $request)
    {
        $danhSachCongViec = $request->input('danh_sach_cong_viec');
    
        foreach ($danhSachCongViec as $congViecData) {
            $cv_id = $congViecData['cv_id'];
            $congViec = CongViec::find($cv_id);
    
            if (!$congViec) {
                return response()->json(['message' => 'Không tìm thấy công việc'], 404);
            }
    
            // Kiểm tra quyền truy cập của người dùng
            $user = auth()->user();
            if ($user) {
                // Cập nhật trạng thái công việc
                $trangThai = $congViecData['bchn_trangthai'];
                if (in_array($trangThai, [1, 2, 3, 4])) {
                    $congViec->cv_trangthai = $trangThai;
                    $congViec->save();
                } else {
                    return response()->json(['message' => 'Trạng thái công việc không hợp lệ'], 400);
                }
            }
        }
    
        return response()->json(['message' => 'Cập nhật trạng thái công việc thành công'], 200);
    }
    
}
