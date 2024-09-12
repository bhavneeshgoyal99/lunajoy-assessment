import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create Auth Context
export const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User state
    const [loading, setLoading] = useState(true); // Loading state to handle auto login
    const navigate = useNavigate();

    // Function to handle login
    const login = (userData) => {
        setUser(userData); 
        localStorage.setItem('user', JSON.stringify(userData)); // Persist user data in localStorage
        navigate('/health-form'); // Redirect to dashboard after login
    };

    // Function to handle logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Clear user data
        navigate('/login'); // Redirect to login page
    };

    // Auto login if user data is present in localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false); // Finished loading
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
