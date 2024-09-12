import React, { useContext, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { URLS } from '../../utils/urls';
import './progressTracker.css';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProgressTracker = () => {
    const {user} = useContext(AuthContext);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if(user?.at_token) getAnalytics();
    }, [user]);

    const getAnalytics = async () => {
        const headers = {
            at_token: user?.at_token,
        }

        const url = URLS.analytics;
        const response = await axios.get(url, {headers});
        if(response?.data?.success) {
            setLogs(response?.data?.data);
        }else{
            alert("Server Error");
        }
    }

    // Sample data (In actual project, fetch this from your backend)
    // const data = {
    //     labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    //     datasets: [
    //         {
    //             label: 'Mood Rating',
    //             data: [3, 4, 5, 2, 4, 4, 5],
    //             fill: false,
    //             borderColor: 'rgb(75, 192, 192)',
    //             tension: 0.1,
    //         },
    //         {
    //             label: 'Anxiety Levels',
    //             data: [2, 3, 4, 5, 3, 2, 1],
    //             fill: false,
    //             borderColor: 'rgb(255, 99, 132)',
    //             tension: 0.1,
    //         },
    //         {
    //             label: 'Sleep Hours',
    //             data: [7, 6, 5, 6, 8, 7, 9],
    //             fill: false,
    //             borderColor: 'rgb(53, 162, 235)',
    //             tension: 0.1,
    //         }
    //     ]
    // };

    const getChart = () => {
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Mental Health Progress Tracker',
                },
            },
        };
        
        const data = {
            labels: logs.map(item => `Day ${item._id.day}`),
            datasets: [
                {
                    label: 'Mood Rating',
                    data: logs.map(item => item.moodRating),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                },
                {
                    label: 'Anxiety Levels',
                    data: logs.map(item => item.anxietyLevel),
                    fill: false,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                },
                {
                    label: 'Sleep Hours',
                    data: logs.map(item => item.sleepHours),
                    fill: false,
                    borderColor: 'rgb(53, 162, 235)',
                    tension: 0.1,
                }
            ]
        };
        

        return <Line data={data} options={options} />;
    }


    return (
        <div className="progress-container">
            <h2>Mental Health Progress</h2>
            <div className="chart">
                {logs.length ? getChart() : ""}
            </div>
        </div>
    );
};

export default ProgressTracker;
