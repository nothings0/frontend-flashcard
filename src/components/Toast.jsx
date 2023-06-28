import { useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../redux/toastSlice";

const Toast = () => {
  const dispatch = useDispatch();
  const { toast, success } = useSelector((state) => state.toast);

  const handleClose = () => {
    dispatch(hideToast());
  };

  useEffect(() => {
    setTimeout(() => {
      handleClose();
    }, 5000);
  }, []);

  return (
    <div className={`toast ${success ? "success" : "error"}`}>
      <div className="toast__icon">
        {success ? (
          <i className="fa-solid fa-check"></i>
        ) : (
          <i className="fa-solid fa-exclamation"></i>
        )}
      </div>
      <div className="toast__txt">
        <div className="toast__txt__type">{success ? "success" : "error"}</div>
        <div className="toast__txt__des">{toast}</div>
      </div>
      <div className="toast__close" onClick={handleClose}>
        <i className="fa-solid fa-xmark"></i>
      </div>
    </div>
  );
};

export default memo(Toast);
