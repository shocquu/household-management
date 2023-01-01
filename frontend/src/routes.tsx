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

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (!user) return <Navigate to='/login' replace />;
    if (!loading) return children;
};

const RestrictedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (user) return <Navigate to='/' replace />;

    if (!loading) return children;
};

const Routes = () => {
    const routes = useRoutes([
        {
            path: '/board',
            element: (
                <ProtectedRoute>
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
                <RestrictedRoute>
                    <LoginPage />
                </RestrictedRoute>
            ),
        },
        {
            path: 'register',
            element: (
                <RestrictedRoute>
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

const RoutesWrapper = () => (
    <Router>
        <Routes />
    </Router>
);

export default RoutesWrapper;
