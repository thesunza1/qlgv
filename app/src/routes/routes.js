import Login from '~/pages/Login';
import Home from '~/pages/Home';
import Unit from '~/pages/Unit';
import Plan from '~/pages/Plan';
import Report from '~/pages/Report';

// Public routes
const publicRoutes = [
    { path: '/', component: Login, layout: null },
    { path: '/home', component: Home },
    { path: '/unit', component: Unit },
    { path: '/plan', component: Plan },
    { path: '/report', component: Report },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
