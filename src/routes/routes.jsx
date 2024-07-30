import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/common/Login';
import SignUp from '../pages/customer/SignUp';
import ForgotPassword from '../pages/common/ForgotPassword';
import VerificationMail from '../pages/common/VerificatioMail';
import VerifiedStatus from '../pages/common/VerifiedStatus';
import ResetPassword from '../pages/common/ResetPassword';
import ResetSuccess from '../pages/common/ResetSuccess';
import ProtectedRoute from './ProtectedRoute';
import AuthGuard from './AuthGuard';
import CustomerHome from '../pages/customer/CustomerHome';
import MechanicHome from '../pages/mechanic/MechanicHome';
import AdminHome from '../pages/admin/AdminHome';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminBookingPage from '../pages/admin/AdminBookingPage';
import AdminBreakDown from '../pages/admin/AdminBreakDown';
import AdminServices from '../pages/admin/AdminServices';
import AdminMechanicsList from '../pages/admin/AdminMechanicsList';
import AdminCustomersList from '../pages/admin/AdminCustomersList';
import AdminSpareParts from '../pages/admin/AdminSpareParts';
import AdminServiceHistory from '../pages/admin/AdminServiceHistory';
import ProfilePage from '../pages/common/ProfilePage';
import CustomerServiceBooking from '../pages/customer/CustomerServiceBooking';
import CustomerServiceHistory from '../pages/customer/CustomerServiceHistory';
import CustomerVehicle from '../pages/customer/CustomerVehicle';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute role='customer'>
                <CustomerHome />
            </ProtectedRoute>
        ),
        children: [
            {
                path: 'profile-page',
                element: <ProfilePage />
            },
            {
                path: '',
                element: <CustomerServiceBooking />
            },
            {
                path: 'user-service-history',
                element: <CustomerServiceHistory />
            },
            {
                path: 'user-vehicle',
                element: <CustomerVehicle />
            },
        ]
    },
    {
        path: 'mechanic',
        element: (
            <ProtectedRoute roler='mechanic'>
                <MechanicHome />
            </ProtectedRoute>
        ),
        children: [
            {
                path: 'profile-page',
                element: <ProfilePage />
            },
        ]
    },
    {
        path: 'admin',
        element: (
            <ProtectedRoute role='admin'>
                <AdminHome />
            </ProtectedRoute>
        ),
        children: [
            {
                path: 'profile-page',
                element: <ProfilePage />
            },
            {
                path: '',
                element: <AdminDashboard />
            },
            {
                path: 'admin-booking',
                element: <AdminBookingPage />
            },
            {
                path: 'admin-breakdown',
                element: <AdminBreakDown />
            },
            {
                path: 'admin-service',
                element: <AdminServices />
            },
            {
                path: 'admin-mechanics',
                element: <AdminMechanicsList />
            },
            {
                path: 'admin-customers',
                element: <AdminCustomersList />
            },
            {
                path: 'admin-spare-parts',
                element: <AdminSpareParts />
            },
            {
                path: 'admin-service-history',
                element: <AdminServiceHistory />
            },
        ]
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