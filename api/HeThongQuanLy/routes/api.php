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
    Route::get('getKeHoach', [KeHoachController::class, 'getKeHoach']);
    Route::post('auth/logout', [NhanVienController::class, 'logout']);
    Route::get('/get_CV_KeHoach', [KeHoachController::class, 'get_CV_KeHoach']);
    Route::post('/create_KeHoach', [KeHoachController::class, 'create_KeHoach']);
    Route::put('/update_KeHoach/{kh_id}', [KeHoachController::class, 'update_KeHoach']);
    Route::delete('/delete_KeHoach/{kh_id}', [KeHoachController::class, 'delete_KeHoach']);
    Route::get('/get_CV_Thang/{thang}', [KeHoachController::class, 'get_CV_Thang']);
});

// Các route khác liên quan đến nhân viên, đơn vị, phòng, ...

//Router lấy danh sách Nhân Viên
Route::get('/getNhanVien', [NhanVienController::class, 'getNhanVien']);
//Router lấy danh sách Công Việc
Route::get('/getCongViec', [CongViecController::class, 'getCongViec']);
//Kế hoạch

//Đơn vị
Route::get('/getDonVi', [DonViController::class, 'getDonVi']);
Route::get('/list_donvi', [DonViController::class, 'index']);
Route::post('/add_donvi', [DonViController::class, 'store']);
Route::put('/update_donvi/{dv_id}', [DonViController::class, 'update']);
Route::delete('/delete_donvi/{dv_id}', [DonViController::class, 'destroy']);
Route::post('/get_DV_NhanVien', [DonViController::class, 'get_DV_NhanVien']);

//công việc 
Route::post('/kehoach/{kh_id}/congviec', [KeHoachController::class, 'themCongViec']);
Route::post('addKeHoach', [KeHoachController::class, 'store']);