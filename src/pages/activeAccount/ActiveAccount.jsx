import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ActiveAccount } from "../../redux/apiRequest";
import logo from "../../assets/Lo-go.png";
import Skeleton from "../../components/Skeleton";
import { useDispatch } from "react-redux";
import { showToast } from "../../redux/toastSlice";

const ActiveAccountPage = () => {
  const { slug } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleActive = async () => {
      setLoading(true);
      try {
        const res = await ActiveAccount({ active_token: slug });
        setError(false);
        dispatch(showToast({ msg: res.msg, success: true }));
        setLoading(false);
      } catch (error) {
        setError(true);
        dispatch(showToast({ msg: error.response.data.msg, success: false }));
        setLoading(false);
      }
    };
    handleActive();
  }, [slug]);

  if (loading) return <Skeleton />;

  return (
    <div className="midle-active">
      <div className="midle-active__img">
        <img src={logo} alt="Logo" />
      </div>
      {!error ? (
        <>
          <div className="midle-active__heading">
            Chào mừng bạn đến với fluxquiz.com
          </div>
          <div className="midle-active__des">
            Fluxquiz.com hi vọng người dùng sẽ có một trải nghiệm tốt khi học
            tập trên Fluxquiz.com. Cảm ơn bạn đã đến với chúng tôi.
          </div>
          <div className="midle-active__footer">
            <Link to={`/login`}>Quay lại trang đăng nhập</Link>
          </div>
        </>
      ) : (
        <>
          <div className="midle-active__heading">Có lỗi xảy ra</div>
          <div className="midle-active__des">
            Đã quá thời gian xác nhận. Vui lòng gửi lại yêu cầu để tiếp tục.
          </div>
          <div className="midle-active__footer">
            <Link to={`/login`}>Quay lại trang đăng nhập </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ActiveAccountPage;
