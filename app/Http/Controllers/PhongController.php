<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\Phong;
class PhongController extends Controller
{
   public function index()
    {
        $Phongs = Phong::with('nhanviens')->get();
        return response()->json($Phongs);
    }
}