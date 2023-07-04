import TrangChu from '~/pages/TrangChu';
import DonVi from '~/pages/DonVi';
import NhanVien from '~/pages/DonVi/NhanVien';
import KeHoach from '~/pages/KeHoach';
import BaoCaoHangNgay from '~/pages/BaoCao/BaoCaoHangNgay';
import CongViec from '~/pages/KeHoach/CongViec/CongViec';
import XinGiaHan from '~/pages/KeHoach/XinGiaHan/XinGiaHan';
import KeHoachThang from '~/pages/KeHoach/KeHoachThang/KeHoachThang';
import ChiTietKeHoach from '~/pages/KeHoach/ChiTietKeHoach/ChiTietKeHoach';
import DSXinGiaHan from '~/pages/KeHoach/DSXinGiaHan/dsXinGiaHan';

// Public routes
const publicRoutes = [
    { path: 'trangchu', component: TrangChu },

    { path: 'donvi', component: DonVi },

    { path: 'donvi/:dv_id/:dv_ten/nhanvien', component: NhanVien },

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

    { path: 'baocao', component: BaoCaoHangNgay },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
