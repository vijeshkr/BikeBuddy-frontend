import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator'; // Adjust the path as needed

const AuthGuard = ({ children }) => {
    const user = useSelector((state) => state.user.user);
    const loading = useSelector((state) => state.loading);

    // If the application is in a loading state, display a loading indicator
    if (loading) {
        return <LoadingIndicator />;
    }

    if (user) {
        // Redirect based on user role
        if (user.role === 'customer') {
            return <Navigate to={`/`} />;
        } else {
            return <Navigate to={`/${user.role}`} />;
        }

    } else {
        // If no user is authenticated, render the children components
        return children;
    }
};

export default AuthGuard;
