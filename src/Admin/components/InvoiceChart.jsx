import React, { useEffect, useState } from "react";
import { adminGetCards, getInvoiceChart } from "../../redux/apiRequest";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Invoice from "./Invoice";

const InvoiceChart = () => {
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getInvoiceChart({ accessToken });
        const resCard = await adminGetCards({
          accessToken,
          page: 1,
          limit: 7,
          sort: "views: desc",
        });

        setData({ invoices: res.data, cards: resCard.data.cards });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  if (data.length === 0) return;

  return (
    <div className="charts-grid">
      <div className="chart-card income-chart">
        <h2 className="chart-title">Doanh thu</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.invoices}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="income" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-card-wrap">
        <div className="chart-card visitor-chart">
          <div className="admin-header-title">
            <h2 className="chart-title">Top thẻ flashcard</h2>
            <Link to="/admin/flashcard" className="view-all-link">
              Xem thêm
            </Link>
          </div>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Views</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.cards.map((item, index) => (
                <tr key={item._id}>
                  <td>
                    <Link to={`/card/${item.slug}`}>{item.title}</Link>
                  </td>
                  <td>{item.views.toLocaleString()}</td>
                  <td>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                </tr>
              ))}
              {data.cards.length === 0 && (
                <tr>
                  <td colSpan="3" className="no-data">
                    No cards found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Invoice />
      </div>
    </div>
  );
};

export default InvoiceChart;
