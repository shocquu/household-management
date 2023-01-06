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

const ProtectedRoute = ({ user, children }) => {
    if (!user) return <Navigate to='/login' replace />;
    return children;
};

const RestrictedRoute = ({ user, children }) => {
    if (user) return <Navigate to='/' replace />;
    return children;
};

const Routes = ({ user }: { user: User }) => {
    const routes = useRoutes([
        {
            path: '/board',
            element: (
                <ProtectedRoute user={user}>
                    <DashboardLayout />
                </ProtectedRoute>
            ),
            children: [
                { element: <Navigate to='/board/tasks' />, index: true },
                {
                    path: 'tasks',
                    element: <DashboardAppPage />,
                },
                { path: 'tags', element: <UserPage /> },
                { path: 'products', element: <ProductsPage /> },
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
                { element: <Navigate to='/board' />, index: true },
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

const RoutesWrapper = () => {
    const { user, loading } = useAuth();

    if (loading) return <CircularProgress />;

    return (
        <Router>
            <Routes user={user} />
        </Router>
    );
};

export default RoutesWrapper;
