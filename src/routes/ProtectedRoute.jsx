import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';

const ProtectedRoute = ({ children, role }) => {
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.loading);

  // While data is still loading show a loading indication
  if (loading) {
    return <LoadingIndicator />
  } else if (!user) {
    // If the user is not logged in redirect to the login page
    return <Navigate to="/login" />;
  }
  // If the user has the correct role, render child components
  if (user.role === role) {
    return children;
  } else {
    // If the user does not have the correct role, redirect to the page based on the user's role
    return <Navigate to={`/${user.role}`} />
  }
};

export default ProtectedRoute;
