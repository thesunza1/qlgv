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
    
 

}
