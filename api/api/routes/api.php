<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NhanVienController;
use App\Http\Controllers\DonViController;
use App\Http\Controllers\PhongController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KeHoachController;
use App\Http\Controllers\CongViecController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Các route không yêu cầu xác thực
Route::post('auth/SignIn', [NhanVienController::class, 'SignIn']);

// Các route yêu cầu xác thực
Route::group(['middleware' => 'jwt.auth'], function () {
    Route::get('user-info', [NhanVienController::class, 'getUserInfo']);
    Route::get('nhanvien/kehoach', [NhanVienController::class, 'getKeHoach']);
    Route::get('/get_KeHoach', [KeHoachController::class, 'get_KeHoach']);
    Route::post('auth/logout', [NhanVienController::class, 'logout']);
});
 
// Các route khác liên quan đến nhân viên, đơn vị, phòng, ...

//Router lấy danh sách Nhân Viên của đơn vị đã chọn
Route::post('/get_DV_NhanVien', [DonViController::class, 'get_DV_NhanVien']);
//Router lấy danh sách Nhân Viên
Route::get('/getNhanVien', [NhanVienController::class, 'getNhanVien']);
//Router lấy danh sách Công Việc
Route::get('/getCongViec', [CongViecController::class, 'getCongViec']);
//Router lấy danh sách Đơn Vị
Route::get('/getDonVi', [DonViController::class, 'getDonVi']);
//Kế hoạch

