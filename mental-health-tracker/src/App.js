import React, { useState, useEffect } from 'react';
import { } from 'react-dom';
import { GoogleLogin } from 'react-google-login';
// import { Chart } from 'react-chartjs-2';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import SweetAlert2 from 'react-sweetalert2';

import Login from './screens/login/index';
import HealthForm from './screens/healthForm';
import Sidebar from './components/sidebar';
import ProgressTracker from './screens/progressTracker';
import DailyLogs from './screens/dailyLogs';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './context/PrivateRoute';
import { SweetAlertProvider } from './context/SweetAlert';

const socket = io('http://localhost:8675');

function App() {
  const [sweetAlertProps, setSweetAlertProps] = useState();

  useEffect(() => {
    socket.on('logCreated', (newLog) => {
      setSweetAlertProps({
        text: "New Log added",
      })
    });

    return () => {
        socket.off('logCreated');
    };
  });
  
  return (
    <>
      <Router>
        <AuthProvider>
          <SweetAlertProvider {...sweetAlertProps}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/health-form" element={
                <PrivateRoute>
                  <HealthForm />
                </PrivateRoute>
              } />

              <Route path="/charts" element={
                <PrivateRoute>
                  <ProgressTracker />
                </PrivateRoute>
              } />

              <Route path="/logs" element={
                <PrivateRoute>
                  <DailyLogs />
                </PrivateRoute>
              } />

              <Route path="/health-form" element={
                <PrivateRoute>
                  <ProgressTracker />
                </PrivateRoute>
              } />
            </Routes>
          </SweetAlertProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;