<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\DonVi;
use App\Models\CongViec;
use App\Models\NhanVien;

class DonViController extends Controller
{
  
    public function get_DonVi(Request $request)
    {
        $donVis = DonVi::with(['nhanViens', 'dv_id_dvtruong', 'dv_dvcha'])->get();
        $soLuongDonVi = $donVis->count(); // Đếm số lượng đơn vị

        $donVis->each(function ($donVi) {
            $donVi->so_luong_nhan_vien = $donVi->nhanViens->count(); // Tổng số lượng nhân viên của đơn vị

            $donVi->nhanViens->each(function ($nhanVien) use ($donVi) {
                if ($nhanVien->id === $donVi->dv_id_dvtruong) {
                    $donVi->ten_don_vi_truong = $nhanVien->nv_ten;
                }
            });
        });

        $tongSoNhanVien = $donVis->sum('so_luong_nhan_vien'); // Tính tổng số nhân viên của tất cả đơn vị

        return response()->json([
            'so_luong_don_vi' => $soLuongDonVi,
            'so_luong_nhan_vien' => $tongSoNhanVien,
            'don_vis' => $donVis,
        ]);
    }

    public function get_ID_DonVi(Request $request, $dv_id)
    {
        $donVi = DonVi::with(['nhanViens', 'dv_id_dvtruong', 'dv_dvcha'])->find($dv_id);

        if (!$donVi) {
            return response()->json(['message' => 'Không tìm thấy đơn vị'], 404);
        }

        $donVi->so_luong_nhan_vien = $donVi->nhanViens->count(); // Tổng số lượng nhân viên của đơn vị

        $donVi->nhanViens->each(function ($nhanVien) use ($donVi) {
            if ($nhanVien->id === $donVi->dv_id_dvtruong) {
                $donVi->ten_don_vi_truong = $nhanVien->nv_ten;
            }
        });

        return response()->json(['don_vi' => $donVi]);
    }


    public function get_DV_NhanVien(Request $request)
    {
        $donViId = $request->input('dv_id'); // Lấy ID của đơn vị từ request

        // Kiểm tra nếu đơn vị không tồn tại
        $donVi = DonVi::find($donViId);
        if (!$donVi) {
            return response()->json(['message' => 'Không tìm thấy đơn vị'], 404);
        }

        // Lấy danh sách nhân viên của đơn vị
        $nhanViens = NhanVien::where('dv_id', $donViId)->get();
        // Tính tổng số nhân viên
        $tongSoNhanVien = $nhanViens->count();

        // Chuẩn bị dữ liệu trả về
        $responseData = [
            'don_vi_id' => $donViId,
            'don_vi_ten' => $donVi->dv_ten,
            'so_luong_nhan_vien' => $tongSoNhanVien,
            'nhan_viens' => $nhanViens,
        ];

        return response()->json($responseData);
    }

    public function index()
    {
        $donvi = DonVi::all();
        return response()->json($donvi);
    }
   
    public function add_DonVi(Request $request)
    {
        $donvi = new DonVi;
        $donvi->dv_ten = $request->input('dv_ten');
        $donvi->dv_id_dvtruong = $request->input('dv_id_dvtruong');
        $donvi->dv_dvcha = $request->input('dv_dvcha');
        $donvi->save();

        return response()->json($donvi, 200);
    }

    public function update_DonVi(Request $request, $dv_id)
    {
        $donvi = DonVi::findOrFail($dv_id);
        $donvi->dv_ten = $request->input('dv_ten');
        $donvi->dv_id_dvtruong = $request->input('dv_id_dvtruong');
        $donvi->dv_dvcha = $request->input('dv_dvcha');
        $donvi->save();

        return response()->json($donvi, 200);
    }

    public function delete_DonVi(Request $request)
    {
        $selectedIds = $request->input('deletedv_ids'); // Lấy danh sách ID đơn vị đã chọn từ request

        try {
            foreach ($selectedIds as $dv_id) {
                $donVi = DonVi::findOrFail($dv_id);

                // Lấy danh sách nhân viên thuộc đơn vị
                $nhanViens = $donVi->nhanViens;

                // Đặt dv_id của nhân viên thành null
                foreach ($nhanViens as $nhanVien) {
                    $nhanVien->dv_id = null;
                    $nhanVien->save();
                }

                // Xóa đơn vị
                $donVi->delete();
            }

            return response()->json(['message' => 'Đã xóa đơn vị thành công'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi xóa đơn vị: ' . $e->getMessage()], 500);
        }
    }

}