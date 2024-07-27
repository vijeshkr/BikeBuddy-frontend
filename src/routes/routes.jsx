import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/common/Home';
import Login from '../pages/common/Login';
import SignUp from '../pages/customer/SignUp';
import ForgotPassword from '../pages/common/ForgotPassword';
import VerificationMail from '../pages/common/VerificatioMail';
import VerifiedStatus from '../pages/common/VerifiedStatus';
import ResetPassword from '../pages/common/ResetPassword';
import ResetSuccess from '../pages/common/ResetSuccess';
import ProtectedRoute from './ProtectedRoute';
import AuthGuard from './AuthGuard';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        )
    },
    {
        path: '/login',
        element: (
            <AuthGuard>
                <Login />
            </AuthGuard>
        )
    },
    {
        path: '/register',
        element: (
            <AuthGuard>
                <SignUp />
            </AuthGuard>
        )
    },
    {
        path: '/forgot-password',
        element: (
            <AuthGuard>
                <ForgotPassword />
            </AuthGuard>
        )
    },
    {
        path: '/reset-password/:token',
        element: <ResetPassword />
    },
    {
        path: '/register-success',
        element: <VerificationMail />
    },
    {
        path: '/verify-email/:token',
        element: <VerifiedStatus />
    },
    {
        path: '/reset-success',
        element: <ResetSuccess />
    },
]);

export default router;