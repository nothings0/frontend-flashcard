import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ActiveAccount } from "../../redux/apiRequest";
import logo from "../../assets/Lo-go.png"
const ActiveAccountPage = () => {
  const { slug } = useParams();
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const handleActive = async () => {
      const res = await ActiveAccount({ active_token: slug });
      if (res === false) {
        setMsg(false);
      } else {
        setMsg(res.msg);
      }
    };
    handleActive();
  }, [slug]);
  return (
    <div className="midle-active">
      <div className="midle-active__img">
        <img src={logo} alt="Logo" />
      </div>
      {msg ? (
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
