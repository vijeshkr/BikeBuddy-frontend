import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/common/Home';
import Login from '../pages/common/Login';
import SignUp from '../pages/customer/SignUp';
import ForgotPassword from '../pages/common/ForgotPassword';
import VerificationMail from '../pages/common/VerificatioMail';
import VerifiedStatus from '../pages/common/VerifiedStatus';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/register',
        element: <SignUp/>
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword/>
    },
    {
        path: '/register-success',
        element: <VerificationMail/>
    },
    {
        path: '/verify-email/:token',
        element: <VerifiedStatus/>
    },
]);

export default router;