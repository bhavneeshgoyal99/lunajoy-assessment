import React, { useContext } from 'react';
import './sidebar.css';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();

        navigate('/');
    }

    return (
        <div className="sidebar">
            <h2>Dashboard</h2>
            <ul className="nav-list">
                <li><a href="/health-form">Health Form</a></li>
                <li><a href="/logs">Logs</a></li>
                <li><a href="/charts">Charts</a></li>
                <li><a href="#" onClick={handleLogout}>Logout</a></li>
            </ul>
        </div>
    );
};

export default Sidebar;
