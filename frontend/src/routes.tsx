import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import RegisterPage from './pages/RegisterPage';
import useAuth from './hooks/useAuth';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingsPage';
import LoadingScreen from './layouts/loadingScreen';

const ProtectedRoute = ({ isLoggedIn, children }) => {
    if (!isLoggedIn) return <Navigate to='/login' replace />;
    return children;
};

const RestrictedRoute = ({ isLoggedIn, children }) => {
    if (isLoggedIn) return <Navigate to='/' replace />;
    return children;
};

const RoutesWrapper = () => {
    const { user, isLoggedIn } = useAuth();

    const routes = useRoutes([
        {
            path: '/dashboard',
            element: (
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <DashboardLayout />
                </ProtectedRoute>
            ),
            children: [
                { element: <Navigate to='/dashboard/app' />, index: true },
                {
                    path: 'app',
                    element: <DashboardAppPage />,
                },
                { path: 'tags', element: <UserPage /> },
                { path: 'products', element: <ProductsPage /> },
            ],
        },
        {
            path: '/user',
            element: (
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <DashboardLayout />
                </ProtectedRoute>
            ),
            children: [
                { element: <Navigate to='/user/account' />, index: true },
                {
                    path: 'account',
                    element: <AccountPage />,
                },
                { path: 'settings', element: <SettingsPage /> },
            ],
        },
        {
            path: 'tags',
            element: (
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <UserPage />
                </ProtectedRoute>
            ),
        },
        {
            path: 'login',
            element: (
                <RestrictedRoute isLoggedIn={isLoggedIn}>
                    <LoginPage />
                </RestrictedRoute>
            ),
        },
        {
            path: 'register',
            element: (
                <RestrictedRoute isLoggedIn={isLoggedIn}>
                    <RegisterPage />
                </RestrictedRoute>
            ),
        },
        {
            element: <SimpleLayout />,
            children: [
                { element: <Navigate to='/dashboard' />, index: true },
                { path: '404', element: <Page404 /> },
                { path: '*', element: <Navigate to='/404' /> },
            ],
        },
        {
            path: '*',
            element: <Navigate to='/404' replace />,
        },
    ]);

    if (isLoggedIn && !user) return <LoadingScreen />;
    return routes;
};

export default RoutesWrapper;
