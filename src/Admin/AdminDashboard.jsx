import React, { useEffect, useState } from 'react';
import { statistical } from '../redux/apiRequest';
import { useSelector } from 'react-redux';
import InvoiceChart from './components/InvoiceChart';

const AdminDashboard = () => {
  const accessToken = useSelector(state => state.user.currentUser?.accessToken);
  const [period, setPeriod] = useState('all');
  const [statisticalData, setStatisticalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await statistical({ accessToken, period });
        setStatisticalData(res.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken, period]);

  return (
      <div className="admin-dashboard">
        <div className="header-title">
        <h1>Thống kê</h1>
        <select
          name="period"
          id="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="all">All</option>
          <option value="day">Day</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
        <div className="metrics-grid">
          {statisticalData.map((item, index) => (
            <div className="metric-card" key={index}>
              <div className='icon'>
                <i className={item.icon}></i>
              </div>
              <div>
                <h2 className="metric-title">{item.title}</h2>
                <p className="metric-value">
                  {item.value}
                  {
                    item.percentageType === "increase" ? (
                      <span className="metric-change positive">
                        <i className="fas fa-arrow-up"></i> {item.percentageValue}
                      </span>
                    ) : (
                      <span className="metric-change negative">
                        <i className="fas fa-arrow-down"></i> {item.percentageValue}
                      </span>
                    )
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
        <InvoiceChart />
      </div>
  );
};

export default AdminDashboard;
