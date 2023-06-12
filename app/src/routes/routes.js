import TrangChu from '~/pages/TrangChu';

import DonVi from '~/pages/DonVi';
import ThemDonVi from '~/pages/DonVi/ThemDonVi';
import ChinhSuaDonVi from '~/pages/DonVi/ChinhSuaDonVi';
import NhanVien from '~/pages/DonVi/NhanVien';
import ThemNhanVien from '~/pages/DonVi/NhanVien/ThemNhanVien';
import ChinhSuaNhanVien from '~/pages/DonVi/NhanVien/ChinhSuaNhanVien';

import KeHoach from '~/pages/KeHoach';
import BaoCao from '~/pages/BaoCao';

// Public routes
const publicRoutes = [
    { path: 'trangchu', component: TrangChu },

    { path: 'donvi', component: DonVi },
    { path: 'donvi/them', component: ThemDonVi },
    { path: 'donvi/:dv_id/:dv_ten/:dv_id_dvtruong/:dv_dvcha/chinhsua', component: ChinhSuaDonVi },
    { path: 'donvi/:dv_id/nhanvien', component: NhanVien },
    { path: 'donvi/nhanvien/them', component: ThemNhanVien },
    { path: 'donvi/nhanvien/chinhsua', component: ChinhSuaNhanVien },

    { path: 'kehoach', component: KeHoach },
    { path: 'baocao', component: BaoCao },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
