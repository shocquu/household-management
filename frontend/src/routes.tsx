import { Navigate, useRoutes } from 'react-router-dom';
import MainLayout from './layouts/main';
import SimpleLayout from './layouts/simple';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import TasksPage from './pages/TasksPage';
import RegisterPage from './pages/RegisterPage';
import useAuth from './hooks/useAuth';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingsPage';
import LoadingScreen from './layouts/loadingScreen';
import TagsPage from './pages/TagsPage';

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
            path: '/',
            element: (
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <MainLayout />
                </ProtectedRoute>
            ),
            children: [
                { element: <Navigate to='/assigments' />, index: true },

                {
                    path: 'assigments',
                    element: <TasksPage />,
                },
                { path: 'labels', element: <TagsPage /> },
                { path: '/user/settings', element: <SettingsPage /> },
                {
                    path: '/user',
                    element: <AccountPage />,
                    children: [
                        { element: <Navigate to='/user/account' replace={true} />, index: true },
                        {
                            path: 'account',
                            element: <AccountPage />,
                        },
                    ],
                },
            ],
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
                { element: <Navigate to='/' />, index: true },
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
