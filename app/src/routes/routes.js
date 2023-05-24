// Layouts
import { LoginLayout } from '~/layouts/LoginLayout';

// Pages
import Login from '~/pages/Login';

import Home from '~/pages/Home';

// Public routes
const publicRoutes = [
    { path: '/', component: Login, layout: LoginLayout },

    { path: '/home', component: Home },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
