<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\DonVi;

class DonViController extends Controller
{
    public function index()
    {
        $donVis = DonVi::with('nhanviens', 'phongs')->get();
        return response()->json($donVis);
    }
}
