<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\DonVi;

class DonViController extends Controller
{
    public function GetDonVi()
    {
        $donVis = DonVi::with('nhanviens')->select('DV_TEN', 'DV_ID_DVTRUONG', 'DV_DVCHA')->get()->toArray();
        return response()->json($donVis);
    }
}
