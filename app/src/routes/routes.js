import DangNhap from '~/pages/DangNhap';
import TrangChu from '~/pages/TrangChu';
import DonVi from '~/pages/DonVi';
import KeHoach from '~/pages/KeHoach';
import BaoCao from '~/pages/BaoCao';
import NhanVien from '~/pages/DonVi/NhanVien';

// Public routes
const publicRoutes = [
    { path: '/', component: DangNhap, layout: null },
    { path: '/trangchu', component: TrangChu },
    { path: '/donvi', component: DonVi },
    { path: '/donvi/nhanvien', component: NhanVien },

    { path: '/kehoach', component: KeHoach },
    { path: '/baocao', component: BaoCao },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
