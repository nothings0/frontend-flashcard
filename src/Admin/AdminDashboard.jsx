import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { statistical } from '../redux/apiRequest';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const accessToken = useSelector(state => state.user.currentUser?.accessToken);
  const [timeFrame, setTimeFrame] = useState('Week');
  const [statisticalData, setStatisticalData] = useState([]);

  const userData = [
    { day: 'Mon', pageViews: 30, sessions: 20 },
    { day: 'Tue', pageViews: 40, sessions: 30 },
    { day: 'Wed', pageViews: 60, sessions: 50 },
    { day: 'Thu', pageViews: 50, sessions: 40 },
    { day: 'Fri', pageViews: 90, sessions: 80 },
    { day: 'Sat', pageViews: 70, sessions: 60 },
    { day: 'Sun', pageViews: 60, sessions: 50 },
  ];

  const incomeData = [
    { day: 'Mon', income: 7650 },
    { day: 'Tue', income: 6000 },
    { day: 'Wed', income: 4500 },
    { day: 'Thu', income: 7000 },
    { day: 'Fri', income: 3000 },
    { day: 'Sat', income: 5000 },
    { day: 'Sun', income: 4000 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await statistical({accessToken, period: "month"});

        setStatisticalData(res.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }
  , []);

  return (

    <>
      <div className="header-title">
        <h1>Tổng quan</h1>
      </div>
    <div className="admin-dashboard">
      {/* Header Metrics */}
      <div className="metrics-grid">
        {statisticalData && statisticalData.map((item, index) => (
          <div className="metric-card" key={index}>
            <h2 className="metric-title">{item.title}</h2>
            <p className="metric-value">{item.value}</p>
            <p className="metric-change">{item.percentageValue}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Unique Visitor Chart */}
        <div className="chart-card visitor-chart">
          <div className='chart-header'>
            <h2 className="chart-title">UNIQUE VISITOR</h2>
            <div className="timeframe-buttons">
              <button
                onClick={() => setTimeFrame('Month')}
                className={timeFrame === 'Month' ? 'active' : ''}
              >
                Month
              </button>
              <button
                onClick={() => setTimeFrame('Week')}
                className={timeFrame === 'Week' ? 'active' : ''}
              >
                Week
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pageViews" stroke="#8884d8" name="Page Views" />
              <Line type="monotone" dataKey="sessions" stroke="#82ca9d" name="Sessions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Income Overview Chart */}
        <div className="chart-card income-chart">
          <h2 className="chart-title">INCOME OVERVIEW</h2>
          <p className="income-stat">This Week Statistics $7,650</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </>

  );
};

export default AdminDashboard;