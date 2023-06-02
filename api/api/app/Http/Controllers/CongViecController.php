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
        $user = auth()->user();
        // Lấy giá trị các tham số từ request
        $CV_ID = $request->input('cv_id');
        $CV_CV_Cha = $request->input('cv_cv_cha');
    
        // Lấy thông tin người dùng đã xác thực từ token JWT
     
     
        if (!$user) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập'], 401);
        }
    
        try {  
             $userId = $user->nv_id;
            // Lấy danh sách công việc dựa trên các tham số CV_ID và CV_CVCha của người dùng đang đăng nhập
            $danhSachCongViec = CongViec::where('nv_id', $userId)
                                        ->where('cv_id', $CV_ID)
                                        ->where('cv_cv_cha', $CV_CV_Cha)
                                        ->get();
    
            // Trả về dữ liệu JSON
            return response()->json($danhSachCongViec);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi lấy danh sách công việc: ' . $e->getMessage()], 500);
        }
    }
}
