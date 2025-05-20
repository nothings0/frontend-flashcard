import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvoice } from "../redux/apiRequest";
import Skeleton from "../components/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import Search from "../components/Search";
import { syncUserToLocal } from "../util";

const COUNTDOWN_DURATION = 750; // seconds

function PaymentPage() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [expired, setExpired] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(COUNTDOWN_DURATION);

  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  // Lấy hóa đơn lần đầu
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await getInvoice({ invoiceId, accessToken });
        setInvoice(res.invoice);
        setStatus(res.invoice.status || "PENDING");
      } catch (err) {
        console.error("Lỗi load hóa đơn:", err);
      }
    };

    fetchInvoice();
  }, [invoiceId, accessToken]);

  // Đếm ngược theo thời gian tạo invoice
  useEffect(() => {
    if (!invoice?.createdAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const createdTime = new Date(invoice.createdAt).getTime();
      const elapsed = Math.floor((now - createdTime) / 1000);
      const remaining = Math.max(COUNTDOWN_DURATION - elapsed, 0);
      setRemainingSeconds(remaining);
      if (remaining <= 0) {
        setExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [invoice]);

  // Kiểm tra trạng thái đơn hàng mỗi 5s (nếu chưa hết giờ và chưa thanh toán)
  useEffect(() => {
    if (expired || status === "SUCCESS") return;

    const intervalId = setInterval(async () => {
      try {
        const res = await getInvoice({ invoiceId, accessToken });
        setInvoice(res.invoice);
        if (res.invoice.status === "SUCCESS") {
          setStatus("SUCCESS");
          await syncUserToLocal(accessToken, dispatch);
          setShowSuccessPopup(true);
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error("Lỗi kiểm tra trạng thái:", err);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [invoiceId, accessToken, expired, status]);

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  if (!invoice) return <Skeleton type="loading" />;

  const qrUrl = `https://qr.sepay.vn/img?bank=BIDV&acc=96247FLUXQUIZ&template=compact&amount=${invoice.amount}&des=${invoice.code}&accountName=PHAM VAN NHAN`;

  const progressPercent =
    ((COUNTDOWN_DURATION - remainingSeconds) / COUNTDOWN_DURATION) * 100;

  return (
    <>
      <Search />
      <div className="invoice-guide">
        <h2 className="invoice-title">
          THANH TOÁN ĐƠN HÀNG <b>#{invoice.code}</b>
        </h2>

        <div className="guide-grid">
          {/* Cột trái */}
          <div className="left">
            <h3 className="method-title">
              Cách 1: Mở app ngân hàng và quét mã QR
            </h3>
            <img src={qrUrl} alt="QR Code" className="qr-image" />
            <a
              href={qrUrl}
              download
              className="download-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              ⬇ Tải ảnh QR
            </a>

            <div className="countdown-bar-wrapper">
              <div className="countdown-bar">
                <div
                  className="countdown-progress"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="countdown-text">
                {status === "SUCCESS" ? (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    ✅ Đã thanh toán
                  </span>
                ) : expired ? (
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    ❌ Hết thời gian thanh toán!
                  </span>
                ) : (
                  <>
                    ⏳ Đang chờ thanh toán ({formatCountdown(remainingSeconds)})
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Cột phải */}
          <div className="right">
            <h3 className="method-title">
              Cách 2: Chuyển khoản thủ công theo thông tin
            </h3>
            <div className="info-list">
              <p>
                <strong>Ngân hàng:</strong> BIDV
              </p>
              <p>
                <strong>Chủ tài khoản:</strong> PHẠM VĂN NHÂN
              </p>
              <p>
                <strong>Số tài khoản:</strong> 5120925919
              </p>
              <p>
                <strong>Số tiền:</strong>{" "}
                {Number(invoice.amount).toLocaleString()}đ
              </p>
              <p>
                <strong>Nội dung CK:</strong>{" "}
                <span className="payment-code">{invoice.code}</span>
              </p>
              <p className="note">
                <strong>Lưu ý:</strong> Vui lòng giữ nguyên nội dung chuyển
                khoản <strong>{invoice.code}</strong> để hệ thống tự động xác
                nhận thanh toán.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popup thành công */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="custom-modal">
            <div className="succes succes-animation icon-top">
              <i className="fa fa-check"></i>
            </div>
            <div className="succes border-bottom"></div>
            <div className="content">
              <p className="type">Thành công</p>
              <p className="message-type">
                Chúc mừng bạn đã nâng cấp thành công
              </p>
              <a href="/">Quay lại</a>
            </div>
          </div>
        </div>
      )}

      {/* Popup lỗi khi hết giờ */}
      {expired && status !== "SUCCESS" && (
        <div className="popup-overlay">
          <div className="error-modal">
            <div className="icon-top">
              <i className="fa fa-times"></i>
            </div>
            <div className="border-bottom"></div>
            <div className="content">
              <p className="type">Lỗi</p>
              <p className="message-type">Hết thời gian thanh toán</p>
              <a href="/pricing">Quay lại</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PaymentPage;
