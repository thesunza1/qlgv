import TrangChu from '~/pages/TrangChu';
import CongViec from '~/pages/KeHoach/CongViec/CongViec';
import DonVi from '~/pages/DonVi';
import ThemDonVi from '~/pages/DonVi/ThemDonVi';
import ChinhSuaDonVi from '~/pages/DonVi/ChinhSuaDonVi';
import NhanVien from '~/pages/DonVi/NhanVien';
import ThemNhanVien from '~/pages/DonVi/NhanVien/ThemNhanVien';
import ChinhSuaNhanVien from '~/pages/DonVi/NhanVien/ChinhSuaNhanVien';

import KeHoach from '~/pages/KeHoach';
import BaoCao from '~/pages/BaoCao';
import ThemKeHoach from '~/pages/KeHoach/ThemKeHoach/ThemKeHoach';
import XinGiaHan from '~/pages/KeHoach/XinGiaHan/XinGiaHan';
import KeHoachThang from '~/pages/KeHoach/KeHoachThang/KeHoachThang';
import ThemCongViec from '~/pages/KeHoach/CongViec/ThemCongViec';
import ChiTietKeHoach from '~/pages/KeHoach/ChiTietKeHoach/ChiTietKeHoach';
import DSXinGiaHan from '~/pages/KeHoach/DSXinGiaHan/dsXinGiaHan';
import ChinhSuaKH from '~/pages/KeHoach/ChinhSuaKeHoach/ChinhSuaKeHoach';
import ChinhSuaCV from '~/pages/KeHoach/ChinhSuaKeHoach/ChinhSuaCongViec';

// Public routes
const publicRoutes = [
    { path: 'trangchu', component: TrangChu },

    // { path: 'donvi', component: DonVi },
    // { path: 'donvi/them', component: ThemDonVi },
    // { path: 'donvi/:dv_id/:dv_ten/:dv_id_dvtruong/:dv_dvcha/chinhsua', component: ChinhSuaDonVi },
    // { path: 'donvi/:dv_id/nhanvien', component: NhanVien },
    // { path: 'donvi/nhanvien/them', component: ThemNhanVien },
    // { path: 'donvi/nhanvien/chinhsua', component: ChinhSuaNhanVien },

    { path: 'kehoach', component: KeHoach },
    { path: 'kehoach/them', component: ThemKeHoach },
    { path: 'kehoach', component: KeHoachThang },
    { path: 'kehoach/:kh_id/:kh_ten/:nv_id/:kh_tongthgian/:kh_thgianketthuc/chitiet', component: ChiTietKeHoach },
    { path: 'kehoach/:kh_id/:kh_ten/:kh_thgianbatdau/:kh_thgianketthuc/:dv_id/:nv_id/chinhsua', component: ChinhSuaKH },
    { path: 'congviec/:cv_id/:cv_ten/:cv_thgianbatdau/:cv_thgianhoanthanh/:dv_id/:nv_id/chinhsua', component: ChinhSuaCV },
    { path: 'kehoach/thang', component: KeHoachThang },
    { path: 'congviec/:cv_id/:cv_ten/:cv_thgianhoanthanh/xingiahan', component: XinGiaHan },
    { path: 'congviec/dsxingiahan', component: DSXinGiaHan },
    { path: 'congviec', component: CongViec },
    { path: 'congviec/them', component: ThemCongViec },

    { path: 'baocao', component: BaoCao },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
