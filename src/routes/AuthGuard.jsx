import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator'; // Adjust the path as needed

const AuthGuard = ({ children }) => {
    const user = useSelector((state) => state.user.user);
    const loading = useSelector((state) => state.loading);

    if (loading) {
        return <LoadingIndicator />;
    }
    
    if (user) {
        // Redirect based on user role
        return <Navigate to={`/${user.role}`} />;
    } else {
        return children;
    }
};

export default AuthGuard;
