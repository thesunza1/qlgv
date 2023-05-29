import Login from '~/pages/Login';
import Home from '~/pages/Home';
import Unit from '~/pages/Unit';
import Plan from '~/pages/Plan';
import Report from '~/pages/Report';
import NhanVien from '~/pages/Unit/NhanVien';

// Public routes
const publicRoutes = [
    { path: '/', component: Login, layout: null },
    { path: '/trangchu', component: Home },
    { path: '/donvi', component: Unit },
    { path: '/donvi/nhanvien', component: NhanVien },

    { path: '/kehoach', component: Plan },
    { path: '/baocao', component: Report },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
