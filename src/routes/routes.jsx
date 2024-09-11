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
import AdminServices from '../pages/admin/AdminServices';
import AdminMechanicsList from '../pages/admin/AdminMechanicsList';
import AdminCustomersList from '../pages/admin/AdminCustomersList';
import AdminSpareParts from '../pages/admin/AdminSpareParts';
import ProfilePage from '../pages/common/ProfilePage';
import CustomerServiceBooking from '../pages/customer/CustomerServiceBooking';
import CustomerVehicle from '../pages/customer/CustomerVehicle';
import PageNotFound from '../pages/common/PageNotFound';
import MechanicDashboard from '../pages/mechanic/MechanicDashboard';
import MechanicSpareParts from '../pages/mechanic/MechanicSpareParts';
import MechanicLeave from '../pages/mechanic/MechanicLeave';
import AdminPackageServicePage from '../pages/admin/AdminPackageServicePage';
import AdminIndividualWorksPage from '../pages/admin/AdminIndividualWorksPage';
import MechanicFilteredSpare from '../pages/mechanic/MechanicFilteredSpare';
import MechanicSpareHome from '../pages/mechanic/MechanicSpareHome';
import CustomerVehicleDetails from '../components/customer/CustomerVehicleDetails';
import NavigateToFirstVehicle from '../components/customer/NavigateToFirstVehicle';
import MechanicListPage from '../pages/admin/MechanicListPage';
import LeavePage from '../pages/admin/LeavePage';
import BillingPage from '../pages/admin/BillingPage';
import AdminBookingHome from '../pages/admin/AdminBookingHome';
import ServiceHistory from '../pages/common/ServiceHistory';
import MechanicTargets from '../pages/admin/MechanicTargets';
import MechanicSalary from '../components/admin/MechanicSalary';
import SuccessPage from '../pages/customer/SuccessPage';
import CancelPage from '../pages/customer/CancelPage';

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
                element: <ServiceHistory />
            },
            {
                path: 'user-vehicle',
                element: <CustomerVehicle />,
                children: [
                    {
                        path: '',
                        element: <NavigateToFirstVehicle />
                    },
                    {
                        path: 'my-vehicle/:vehicleId',
                        element: <CustomerVehicleDetails />
                    }
                ]
            },
        ]
    },
    {
        path: 'mechanic',
        element: (
            <ProtectedRoute role='mechanic'>
                <MechanicHome />
            </ProtectedRoute>
        ),
        children: [
            {
                path: 'profile-page',
                element: <ProfilePage />
            },
            {
                path: '',
                element: <MechanicDashboard />
            },
            {
                path: 'mechanic-leave',
                element: <MechanicLeave />
            },
            {
                path: 'mechanic-service-history',
                element: <ServiceHistory />
            },
            {
                path: 'mechanic-spare-parts',
                element: <MechanicSpareParts />,
                children: [
                    {
                        path: '',
                        element: <MechanicSpareHome />
                    },
                    {
                        path: 'filtered-spare',
                        element: <MechanicFilteredSpare />
                    }
                ]
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
                element: <AdminBookingHome />,
                children: [
                    {
                        path: '',
                        element: <AdminBookingPage />,
                    },
                    {
                        path: 'billing/:allocationId',
                        element: <BillingPage />
                    },
                ]
            },

            {
                path: 'admin-service',
                element: <AdminServices />,
                children: [
                    {
                        path: '',
                        element: <AdminPackageServicePage />
                    },
                    {
                        path: 'individual-works',
                        element: <AdminIndividualWorksPage />
                    },
                ]
            },
            {
                path: 'admin-mechanics',
                element: <AdminMechanicsList />,
                children: [
                    {
                        path: '',
                        element: <MechanicListPage />
                    },
                    {
                        path: 'leave-requests',
                        element: <LeavePage />
                    },
                    {
                        path: 'targets',
                        element: <MechanicTargets />
                    },
                    {
                        path: 'salary',
                        element: <MechanicSalary />
                    },
                ]
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
                element: <ServiceHistory />
            },
        ]
    },
    {
        path: "success",
        element: <SuccessPage />
    },
    {
        path: "cancel",
        element: <CancelPage />
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
    {
        path: '/*',
        element: <PageNotFound />
    },
]);

export default router;