import { BrowserRouter as Router, Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import RegisterPage from './pages/RegisterPage';
import useAuth from './hooks/useAuth';
import { useAccessToken } from './hooks/useAccessToken';
import { useUserQuery } from './hooks/useUserQuery';
import { User } from './types';
import { CircularProgress } from '@mui/material';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute = ({ user, children }) => {
    if (!user) return <Navigate to='/login' replace />;
    return children;
};

const RestrictedRoute = ({ user, children }) => {
    if (user) return <Navigate to='/' replace />;
    return children;
};

const RoutesWrapper = () => {
    const { user, loading, isLoggedIn } = useAuth();
    console.log(user);

    const routes = useRoutes([
        {
            path: '/dashboard',
            element: (
                <ProtectedRoute user={user}>
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
                <ProtectedRoute user={user}>
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
            path: 'login',
            element: (
                <RestrictedRoute user={user}>
                    <LoginPage />
                </RestrictedRoute>
            ),
        },
        {
            path: 'register',
            element: (
                <RestrictedRoute user={user}>
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

    return routes;
};

export default RoutesWrapper;
