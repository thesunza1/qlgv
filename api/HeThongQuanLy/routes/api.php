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
use App\Http\Controllers\BaoCaoHangNgayController;
use App\Http\Controllers\LoaiCongViecController;
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
Route::prefix('qlcv')->group(function () {
// Các route không yêu cầu xác thực
Route::post('auth/SignIn', [NhanVienController::class, 'SignIn']);

// Các route yêu cầu xác thực
Route::group(['middleware' => 'jwt.auth'], function () {
    Route::get('user-info', [NhanVienController::class, 'getUserInfo']);
    Route::post('auth/logout', [NhanVienController::class, 'logout']);
    //Router lấy danh sách Kế hoạch
    Route::get('/get_CV_KeHoach', [KeHoachController::class, 'get_CV_KeHoach']);
    Route::post('/create_KeHoach', [KeHoachController::class, 'create_KeHoach']);
    Route::put('/update_KeHoach/{kh_id}', [KeHoachController::class, 'update_KeHoach']);
    Route::delete('/delete_KeHoach', [KeHoachController::class, 'delete_KeHoach']);
    //Router lấy danh sách Công Việc
    Route::get('/get_CV_Thang/{thang}', [CongViecController::class, 'get_CV_Thang']);

});

// Các route khác liên quan đến nhân viên, đơn vị, phòng, ...
//Router lấy danh sách Đơn Vị
Route::get('/get_DonVi', [DonViController::class, 'get_DonVi']);
Route::get('/get_ID_DonVi/{dv_id}', [DonViController::class, 'get_ID_DonVi']);
Route::post('/add_DonVi', [DonViController::class, 'add_DonVi']);
Route::put('/update_DonVi/{dv_id}', [DonViController::class, 'update_DonVi']);
Route::delete('/delete_DonVi', [DonViController::class, 'delete_DonVi']);
Route::post('/get_DV_NhanVien', [DonViController::class, 'get_DV_NhanVien']);

//Router lấy danh sách Công Việc
Route::post('/add_CongViec/{kh_id}/', [CongViecController::class, 'add_CongViec']);
Route::get('/get_CongViec', [CongViecController::class, 'get_CongViec']);
Route::get('/dsCongViecXinGiaHan', [CongViecController::class, 'dsCongViecXinGiaHan']);
Route::post('/duyet_CongViec', [CongViecController::class, 'duyet_CongViec']);
Route::post('/duyetdsCongViecXinGiaHan/{hg_id}', [CongViecController::class, 'duyetdsCongViecXinGiaHan']);
Route::post('/xuly_CongViec', [CongViecController::class, 'xuly_CongViec']);
Route::delete('/delete_CongViec', [CongViecController::class, 'delete_CongViec']);
Route::post('/test_TrangThaiCongViec', [CongViecController::class, 'test_TrangThaiCongViec']);
Route::post('/add_CV_DotXuat', [CongViecController::class, 'add_CV_DotXuat']);
Route::get('/get_CV_DotXuat', [CongViecController::class, 'get_CV_DotXuat']);
Route::post('/phanCongCongViecChoNhanVien', [CongViecController::class, 'phanCongCongViecChoNhanVien']);
Route::put('/update_CongViec', [CongViecController::class, 'update_CongViec']);

//Router lấy danh sách Nhân Viên
Route::get('/get_ID_NhanVien/{nv_id}', [NhanVienController::class, 'get_ID_NhanVien']);
Route::get('/get_NhanVien', [NhanVienController::class, 'get_NhanVien']);
Route::post('/add_NhanVien', [NhanVienController::class, 'add_NhanVien']);
Route::put('/update_NhanVien/{nv_id}', [NhanVienController::class, 'update_NhanVien']);
Route::delete('/delete_NhanVien', [NhanVienController::class, 'delete_NhanVien']);
//Rputer Báo cáo hằng ngay
Route::put('/update_TienDoBaoCaoHangNgay', [BaoCaoHangNgayController::class, 'update_TienDoBaoCaoHangNgay']);
Route::post('/add_CV_BC_HangNgay', [BaoCaoHangNgayController::class, 'add_CV_BC_HangNgay']);
Route::get('/get_CV_BC_HangNgay', [BaoCaoHangNgayController::class, 'get_CV_BC_HangNgay']);
Route::get('/tongGioLamTrongThang/{thang}/{nam}', [BaoCaoHangNgayController::class, 'tongGioLamTrongThang']);
Route::post('/capnhatTGThucHienCV/{cv_id}', [CongViecController::class, 'capnhatTGThucHienCV']);
Route::put('/capNhatTrangThaiCongViec', [CongViecController::class, 'capNhatTrangThaiCongViec']);
Route::delete('/delete_CV_BC_HangNgay', [BaoCaoHangNgayController::class, 'delete_CV_BC_HangNgay']);
// /Rputer Kế Hoạch
Route::post('/get_KeHoach_CongViec', [KeHoachController::class, 'get_KeHoach_CongViec']);
Route::put('/update_KeHoach', [KeHoachController::class, 'update_KeHoach']);
Route::post('/nop_KeHoach', [KeHoachController::class, 'nop_KeHoach']);
Route::post('/duyet_KeHoach', [KeHoachController::class, 'duyet_KeHoach']);
});