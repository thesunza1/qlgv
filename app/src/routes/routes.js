import TrangChu from '~/pages/TrangChu';

import DonVi from '~/pages/DonVi';
import ThemDonVi from '~/pages/DonVi/ThemDonVi';
import ChinhSuaDonVi from '~/pages/DonVi/ChinhSuaDonVi';
import NhanVien from '~/pages/DonVi/NhanVien';
import ThemNhanVien from '~/pages/DonVi/NhanVien/ThemNhanVien';
import ChinhSuaNhanVien from '~/pages/DonVi/NhanVien/ChinhSuaNhanVien';

import KeHoach from '~/pages/KeHoach';
import BaoCaoHangNgay from '~/pages/BaoCao/BaoCaoHangNgay';

import CongViec from '~/pages/KeHoach/CongViec/CongViec';
import XinGiaHan from '~/pages/KeHoach/XinGiaHan/XinGiaHan';
import KeHoachThang from '~/pages/KeHoach/KeHoachThang/KeHoachThang';
import ThemCongViec from '~/pages/KeHoach/CongViec/ThemCongViec';
import ChiTietKeHoach from '~/pages/KeHoach/ChiTietKeHoach/ChiTietKeHoach';
import DSXinGiaHan from '~/pages/KeHoach/DSXinGiaHan/dsXinGiaHan';

// Public routes
const publicRoutes = [
    { path: 'trangchu', component: TrangChu },

    { path: 'donvi', component: DonVi },
    { path: 'donvi/them', component: ThemDonVi },
    { path: 'donvi/:dv_id/chinhsua', component: ChinhSuaDonVi },
    { path: 'donvi/:dv_id/nhanvien', component: NhanVien },
    { path: 'donvi/:dv_id/nhanvien/them', component: ThemNhanVien },
    { path: 'donvi/:dv_id/nhanvien/:nv_id/chinhsua', component: ChinhSuaNhanVien },

    { path: 'kehoach', component: KeHoach },
    { path: 'kehoach', component: KeHoachThang },
    {
        path: 'kehoach/:kh_id/:kh_ten/:nv_id/:kh_thgianbatdau/:kh_thgianketthuc/:kh_trangthai/chitiet',
        component: ChiTietKeHoach,
    },

    { path: 'kehoach/thang', component: KeHoachThang },
    { path: 'congviec/:cv_id/:cv_ten/:cv_thgianketthuc/xingiahan', component: XinGiaHan },
    { path: 'congviec/dsxingiahan', component: DSXinGiaHan },
    { path: 'congviec', component: CongViec },
    { path: 'congviec/them', component: ThemCongViec },

    { path: 'baocao', component: BaoCaoHangNgay },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
