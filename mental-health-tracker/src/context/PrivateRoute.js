import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Sidebar from '../components/sidebar';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    // Wait for loading to complete (important for auto-login)
    if (loading) return <div>Loading...</div>;

    // If not logged in, redirect to login
    return user ? (
        <>
        <Sidebar /> 
        {children}
        </>) : <Navigate to="/login" />;
};

export default PrivateRoute;
