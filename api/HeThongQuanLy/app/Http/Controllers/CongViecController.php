<?php

namespace App\Http\Controllers;
use App\Models\NhanVien;
use App\Models\KeHoach;
use App\Models\DonVi;
use App\Models\CongViec;
use Illuminate\Http\Request;

class CongViecController extends Controller
{
    public function getCongViec(Request $request)
    {
        // Lấy giá trị các tham số từ request
        $NV_ID = $request->input('nv_id');
        $CV_ID = $request->input('cv_id');
        $CV_CV_Cha = $request->input('cv_cv_cha');
    
        // Lấy danh sách công việc dựa trên các tham số NV_ID, CV_ID và CV_CVCha
        $danhSachCongViec = CongViec::where('nv_id', $NV_ID)
                                    ->where('cv_id', $CV_ID)
                                    ->where('cv_cv_cha', $CV_CV_Cha)
                                    ->get();
    
        // Trả về dữ liệu JSON
        return response()->json($danhSachCongViec);
    }
    

}
