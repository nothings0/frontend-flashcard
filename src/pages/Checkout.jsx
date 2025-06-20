import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  getPricingById,
  verifyReferralCode,
  createInvoice,
} from "../redux/apiRequest";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import { showToast } from "../redux/toastSlice";
import { useDispatch, useSelector } from "react-redux";
import Search from "../components/Search";

import feature1 from "../assets/feature-1.png";

const Checkout = () => {
  const dispatch = useDispatch();
  const [referralCode, setReferralCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const tax = 0; // 10% thuế

  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  const navigate = useNavigate();

  const { plan } = useParams();

  const { data: planType, isLoading } = useQuery({
    queryKey: ["plan", plan],
    queryFn: () => getPricingById(plan),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { mutate: applyCode, isLoading: isLoadingMutate } = useMutation({
    mutationFn: (referralCode) => verifyReferralCode(referralCode, accessToken),
    onSuccess: (data) => {
      setDiscount(data.discount || 0, accessToken);
    },
    onError: (error) => {
      setDiscount(0);
      dispatch(
        showToast({
          msg:
            error.response?.data.message || "Mã không hợp lệ hoặc đã hết lượt",
          success: false,
        })
      );
    },
  });

  const handleApplyCode = () => {
    if (referralCode.trim()) {
      applyCode(referralCode.trim());
    }
  };

  const handlePayment = async () => {
    try {
      if (!accessToken) {
        dispatch(
          showToast({
            msg: "Vui lòng đăng nhập để nâng cấp tài khoản!",
            success: false,
          })
        );
        navigate("/login");
        return;
      }

      const res = await createInvoice({
        planType: planType.type,
        amount: total,
        referralCode: referralCode.trim(),
        accessToken,
      });

      const invoice = res?.invoice;

      navigate(`/payment/${invoice.id}`);
    } catch (err) {
      console.error("Lỗi tạo invoice:", err);

      // Nếu server trả về msg và code
      if (err?.code === 400) {
        dispatch(
          showToast({
            msg: err?.msg || "Gói hiện tại vẫn còn hiệu lực!",
            success: false,
          })
        );
        return;
      }
      dispatch(
        showToast({ msg: err?.msg || "Tạo hóa đơn thất bại!", success: false })
      );
    }
  };

  if (isLoading) return <Skeleton />;

  const discountedPrice = planType.price - (planType.price * discount) / 100;
  const total = discountedPrice + discountedPrice * tax;

  return (
    <>
      <Search />
      <div className="checkout-container">
        <div className="checkout-left">
          <h1>Tính năng bạn sẽ nhận được</h1>
          <ul>
            <li>
              <div className="feature-title">
                <h2>🚀 Học tập nâng cao</h2>
                <p>
                  Tiếp cận nội dung độc quyền giúp bạn học sâu, nhanh và hiệu
                  quả hơn.
                </p>
              </div>
              <img src={feature1} alt="Tốc độ" />
            </li>
            <li>
              <div className="feature-title">
                <h2>📈 Luyện nói với Flux AI</h2>
                <p>
                  Luyện kỹ năng nói tiếng Anh trực tiếp với AI phản hồi thông
                  minh như người thật.
                </p>
              </div>
              <img src={feature1} alt="Báo cáo" />
            </li>
            <li>
              <div className="feature-title">
                <h2>💬 Hỏi đáp với Flux AI</h2>
                <p>
                  Giải đáp mọi thắc mắc về bài học, ngữ pháp, từ vựng với trợ lý
                  AI 24/7.
                </p>
              </div>
              <img src={feature1} alt="Hỗ trợ" />
            </li>
            <li>
              <div className="feature-title">
                <h2>🔓 Hỗ trợ tạo học phần bằng AI</h2>
                <p>
                  Chỉ cần vài gợi ý, AI sẽ giúp bạn tạo ra giáo trình học cá
                  nhân hoá cực nhanh.
                </p>
              </div>
              <img src={feature1} alt="Mở khóa" />
            </li>
          </ul>
        </div>
        <div className="checkout-box">
          <div className="checkout-right">
            <h3>Thanh toán</h3>
            <div className="line">
              <span>Giá gốc:</span>
              <span>{planType.price.toLocaleString()}₫</span>
            </div>
            <div className="line">
              <span>Giảm giá ({discount}%):</span>
              <span>
                -{((planType.price * discount) / 100).toLocaleString()}₫
              </span>
            </div>
            <div className="line">
              <span>Thuế ({tax}%):</span>
              <span>{(discountedPrice * tax).toLocaleString()}₫</span>
            </div>
            <div className="line total">
              <span>Tổng cộng:</span>
              <span>{Math.round(total).toLocaleString()}₫</span>
            </div>
            <div className="code-checker">
              <input
                type="text"
                placeholder="Nhập mã giới thiệu"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
              <button onClick={handleApplyCode} disabled={isLoadingMutate}>
                Áp mã
              </button>
            </div>
            <button className="pay-btn" onClick={handlePayment}>
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
