<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\NhanVien;
class NhanVienController extends Controller
{
   public function GetNhanVien()
    {
        $nhanViens = NhanVien::all();
        return response()->json($nhanViens);
    }

    // public function redirectToInterface()
    // {
    //     $user = Auth::user();
        
    //     if ($user->NV_QUYEN === 'giám đốc') {
    //         return redirect()->route('director.plan');
    //     } elseif ($user->NV_QUYEN === 'trưởng phòng' || $user->NV_QUYEN === 'nhân viên') {
    //         return redirect()->route('individual.tasks');
    //     }
    // }
}