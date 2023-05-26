import Login from '~/pages/Login';
import Home from '~/pages/Home';

// Public routes
const publicRoutes = [
    { path: '/', component: Login, layout: null },
    { path: '/home', component: Home },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
