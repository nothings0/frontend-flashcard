import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getInvoices } from "../../redux/apiRequest";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const limit = 10,
    page = 1,
    skip = 0;
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  useEffect(() => {
    const fetchData = async () => {
      const res = await getInvoices({ page, limit, skip, accessToken });
      setInvoices(res.invoices || []);
    };
    if (accessToken) fetchData();
  }, [page, skip, accessToken]);

  return (
    <div className="chart-card visitor-chart">
      <div className="admin-header-title">
        <h2 className="chart-title">Hóa đơn gần đây</h2>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((item, index) => (
            <tr key={item._id}>
              <td>{item.code}</td>
              <td>{item.amount.toLocaleString()} đ</td>
              <td>{dayjs(item.createdAt).format("DD/MM/YYYY")}</td>
            </tr>
          ))}
          {invoices.length === 0 && (
            <tr>
              <td colSpan="3" className="no-data">
                No invoices found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Invoice;
