import React, { useContext, useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import SweetAlert2 from 'react-sweetalert2';

import { URLS } from '../../utils/urls';
import { AuthContext } from '../../context/AuthContext';
import './login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLoginSuccess = async (googleResponse) => {
        const response = await axios.post(URLS.signIn, googleResponse);

        if(response.data.success) {
            await login(response.data.data);
            navigate("/health-form");
        } else {
            alert("error");
        }
    };

    const handleLoginFailure = (error) => {
        console.error('Login Failed:', error);
    };

    return (
        <GoogleOAuthProvider clientId={"117580371774-eoitdr8k2vchlecicv1d7qs033gqlqgo.apps.googleusercontent.com"}>
            <div className="login-container">
                <div className="login-box">
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtitle">Sign in to your account</p>
                    <div className="login-form">
                        <GoogleLogin
                            onSuccess={handleLoginSuccess}
                            onError={handleLoginFailure}
                            buttonText="Login with Google"
                            className="google-button"
                        />
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;
