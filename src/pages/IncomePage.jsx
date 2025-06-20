import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getAffiliateInfo,
  getUserWithdrawals,
  requestWithdrawal,
} from "../redux/apiRequest";
import Skeleton from "../components/Skeleton";
import Search from "../components/Search";
import Header from "../components/Header";
import Helmet from "../components/Helmet";
import { useRequireAuth } from "../Hook/useRequireAuth";
import { useState } from "react";
import BankInfoModal from "../components/BankInfoModal";
import { showToast } from "../redux/toastSlice";
import { useDispatch } from "react-redux";

const IncomePage = () => {
  useRequireAuth();
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const accessToken = JSON.parse(localStorage.getItem("accessToken"));

  // Lấy số dư & ngân hàng
  const { data: accountData, isLoading } = useQuery({
    queryFn: () => getAffiliateInfo(accessToken),
    queryKey: ["affiliate-info"],
  });

  // Lấy lịch sử rút tiền
  const { data: historyData } = useQuery({
    queryKey: ["withdrawals"],
    queryFn: () => getUserWithdrawals(accessToken),
  });

  // Mutation rút tiền
  const mutation = useMutation({
    mutationFn: () => requestWithdrawal(accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries(["withdrawals"]);
      queryClient.invalidateQueries(["affiliate-info"]);
    },
    onError: (error) => {
      dispatch(
        showToast({
          msg: error.response?.data.error || "Có lỗi xảy ra",
          success: false,
        })
      );
    },
  });

  if (isLoading) return <Skeleton />;

  const hasBankInfo = accountData?.bankAccount;

  return (
    <Helmet title="Thu nhập">
      <div className="user">
        <Search />
        <Header />
        <div className="income-page">
          <h2>💰 Thu nhập</h2>

          <div className="balance-box">
            <p>Số dư hiện tại:</p>
            <h3>{accountData.balance.toLocaleString()}đ</h3>
          </div>

          {hasBankInfo ? (
            <div className="withdraw-section">
              <h4>Rút tiền</h4>
              <div className="bank-actions">
                <p>
                  💳 Tài khoản: {hasBankInfo.bankName} - {hasBankInfo.bankAccountNumber} (
                  {hasBankInfo.fullName})
                </p>
              </div>
              <div className="bank-actions__button">
                <button
                  className="edit-btn"
                  onClick={() => setShowModal(true)}
                  disabled={mutation.isLoading}
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => mutation.mutate()}
                  disabled={mutation.isLoading}
                  className="withdraw-btn"
                >
                  {mutation.isLoading ? "Đang xử lý..." : "Yêu cầu rút tiền"}
                </button>
              </div>

              {showModal && (
                <BankInfoModal
                  onClose={() => setShowModal(false)}
                  data={hasBankInfo}
                />
              )}
            </div>
          ) : (
            <>
              <div className="no-bank">
                <p>
                  ⚠️ Bạn chưa cung cấp thông tin ngân hàng.{" "}
                  <span
                    className="update-now"
                    onClick={() => setShowModal(true)}
                  >
                    Cập nhật ngay
                  </span>
                </p>
              </div>
              {showModal && (
                <BankInfoModal onClose={() => setShowModal(false)} />
              )}
            </>
          )}

          <div className="history-section">
            <h4>Lịch sử rút tiền</h4>
            <table className="withdraw-history-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày yêu cầu</th>
                </tr>
              </thead>
              <tbody>
                {historyData?.length > 0 ? (
                  historyData.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.amount.toLocaleString()}đ</td>
                      <td>
                        <span className={`status ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      style={{ textAlign: "center", padding: "1rem" }}
                    >
                      Không có lịch sử rút tiền
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Helmet>
  );
};

export default IncomePage;
