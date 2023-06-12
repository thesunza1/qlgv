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
    Route::post('auth/logout', [NhanVienController::class, 'logout']);
    Route::get('/get_CV_KeHoach', [KeHoachController::class, 'get_CV_KeHoach']);
    Route::post('/create_KeHoach', [KeHoachController::class, 'create_KeHoach']);
    Route::put('/update_KeHoach/{kh_id}', [KeHoachController::class, 'update_KeHoach']);
    Route::delete('/delete_KeHoach', [KeHoachController::class, 'delete_KeHoach']);
    Route::get('/get_CV_Thang/{thang}', [CongViecController::class, 'get_CV_Thang']);

});

// Các route khác liên quan đến nhân viên, đơn vị, phòng, ...

//Router lấy danh sách Nhân Viên
Route::get('/getNhanVien', [NhanVienController::class, 'getNhanVien']);
//Router lấy danh sách Công Việc

//Kế hoạch

//Router lấy danh sách Đơn Vị
Route::get('/getDonVi', [DonViController::class, 'getDonVi']);
Route::post('/add_DonVi', [DonViController::class, 'add_DonVi']);
Route::put('/update_DonVi/{dv_id}', [DonViController::class, 'update_DonVi']);
Route::delete('/delete_DonVi', [DonViController::class, 'delete_DonVi']);
Route::post('/get_DV_NhanVien', [DonViController::class, 'get_DV_NhanVien']);

//công việc 
Route::post('/themCongViec/{kh_id}/', [CongViecController::class, 'themCongViec']);
Route::get('/getCongViec', [CongViecController::class, 'getCongViec']);
Route::get('/dsCongViecXinGiaHan', [CongViecController::class, 'dsCongViecXinGiaHan']);
Route::post('/duyetcongviec/{cv_ids}', [CongViecController::class, 'duyetcongviec']);
Route::post('/duyetdsCongViecXinGiaHan/{hg_id}', [CongViecController::class, 'duyetdsCongViecXinGiaHan']);
Route::post('/xuLyCongViec/{selectedIds}/{action}', [CongViecController::class, 'xuLyCongViec']);
Route::delete('/xoaCongViec', [CongViecController::class, 'xoaCongViec']);
//nhân viên
Route::post('/add_nhanvien', [NhanVienController::class, 'add_nhanvien']);
Route::put('/update_nhanvien/{nv_id}', [NhanVienController::class, 'update_nhanvien']);
Route::delete('/delete_nhanvien/{nv_id}', [NhanVienController::class, 'delete_nhanvien']);