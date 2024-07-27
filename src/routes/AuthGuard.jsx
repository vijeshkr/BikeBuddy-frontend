import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';

const AuthGuard = ({ children }) => {
    // Get the current user from the Redux store
    const user = useSelector((state) => state.user.user);

    // Hooks for navigation and current URL location
    const navigate = useNavigate();
    const location = useLocation();

    // State to control loading indicator visibility
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const hasReloaded = queryParams.get('reloaded');
        let timer;
        if (!hasReloaded) {
            // If 'reloaded' query parameter is not present, set it and reload the page
            navigate(`${location.pathname}?reloaded=true`, { replace: true });
            window.location.reload();
        } else {
            // If 'reloaded' is present, check user authentication status
            timer = setTimeout(() => {
                if (user) {
                    // Redirect authenticated users to the home page
                    navigate('/');
                } else {
                    // If not authenticated, stop loading and render children
                    setIsLoading(false);
                }
            }, 150);
        }

        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timer);
    }, [user, navigate, location.search]);

    // Display a loading indicator while checking authentication status
    if (isLoading) {
        return <LoadingIndicator />;
    }

    // Render children if the user is not authenticated
    return !user ? children : null;
};

export default AuthGuard;
