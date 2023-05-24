<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\NhanVien;
class NhanVienController extends Controller
{
   public function index()
    {
        $nhanViens = NhanVien::all();
        return response()->json($nhanViens);
    }
    
}