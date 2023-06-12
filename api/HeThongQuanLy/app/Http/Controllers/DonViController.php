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
    public function GetDonVi(Request $request)
    {
        $donVis = DonVi::with('nhanViens')->get();
        $soLuongDonVi = $donVis->count(); // Đếm số lượng đơn vị

        $donVis->each(function ($donVi) {
            $donVi->so_luong_nhan_vien = $donVi->nhanViens->count(); // Tổng số lượng nhân viên của đơn vị
            $donVi->nhan_viens = $donVi->nhanViens;
            
            // $donVi->so_luong_cong_viec = $donVi->congViecs->count(); // Tổng số lượng công việc của đơn vị
            // $donVi->cong_viecs = $donVi->congViecs;
        });

        $tongSoNhanVien = $donVis->sum('so_luong_nhan_vien'); // Tính tổng số nhân viên của tất cả đơn vị
        // $tongSoCongViec = $donVis->sum('so_luong_cong_viec'); // Tính tổng số công việc của tất cả đơn vị

        return response()->json([
            'so_luong_don_vi' => $soLuongDonVi,
            'so_luong_nhan_vien' => $tongSoNhanVien,
            // 'so_luong_cong_viec' => $tongSoCongViec,
            'don_vis' => $donVis,
        ]);
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
   
    public function store(Request $request)
    {
        $donvi = new DonVi;
        $donvi->dv_ten = $request->input('dv_ten');
        $donvi->dv_id_dvtruong = $request->input('dv_id_dvtruong');
        $donvi->dv_dvcha = $request->input('dv_dvcha');
        $donvi->save();

        return response()->json($donvi, 200);
    }

    public function update(Request $request, $dv_id)
{
    $donvi = DonVi::findOrFail($dv_id);
    $donvi->dv_ten = $request->input('dv_ten');
    $donvi->dv_id_dvtruong = $request->input('dv_id_dvtruong');
    $donvi->dv_dvcha = $request->input('dv_dvcha');
    $donvi->save();

    return response()->json($donvi, 200);
}
public function destroy($dv_id)
{
    $donvi = DonVi::findOrFail($dv_id);
    $donvi->delete();

    return response()->json(['message' => 'Đã xóa đơn vị thành công'], 200);
}


}