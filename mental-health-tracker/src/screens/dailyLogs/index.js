import React, { useContext, useEffect, useState } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import moment from 'moment';
import './dailyLogs.css';
import { AuthContext } from '../../context/AuthContext';
import { URLS } from '../../utils/urls';

const DailyLogs = () => {
    const {user} = useContext(AuthContext);
    const [logs, setLogs] = useState([]);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Week Range',
                accessor: '_id', // accessing the _id object containing weekStart and weekEnd
                Cell: ({ value }) => (
                    <span>
                        {value.weekStart} - {value.weekEnd}
                    </span>
                )
            },
            {
                Header: 'Mood Rating',
                accessor: 'moodRatings',
            },
            {
                Header: 'Anxiety Levels',
                accessor: 'anxietyLevel',
            },
            {
                Header: 'Sleep Hours',
                accessor: 'sleepPatterns',
            },
        ],
        []
    );

    useEffect(() => {
        if(user?.at_token) getDailyLogs();
    }, [user]);

    const getDailyLogs = async () => {
        const headers = {
            at_token: user?.at_token,
        }
        const currentDate = moment().format('yy-MM-DD');
        const weekDate = moment().subtract(1, 'w').format('yy-MM-DD');
        const url = URLS.logs.concat('?fromDate=').concat(weekDate).concat('&toDate=').concat(currentDate);
        const response = await axios.get(url, {headers});
        if(response?.data?.success) {
            setLogs(response?.data?.data);
        }else{
            alert("Server Error");
        }
    }

    const GetTableView = () => {
        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
        } = useTable({ columns, data: logs });

        return (
            <div className="daily-logs-container">
                <h2>Daily Logs Review</h2>
                <table {...getTableProps()} className="logs-table">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        logs && GetTableView()
    );
};

export default DailyLogs;
