import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.loading);

  if (loading) {
    return <LoadingIndicator />
  } else if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
