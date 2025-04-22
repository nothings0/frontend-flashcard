import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogoutUser } from "../redux/apiRequest";
import { googleLogout } from "@react-oauth/google";
import Notifi from "./Notifi";
const ava = require("../assets/ava1.png");

const SearchAva = () => {
  const user = useSelector(
    (state) => state.user.currentUser?.user
  );
  const profile = useSelector(
    (state) => state.user.currentUser?.user?.profilePic
  );
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogoutActive, setIsLogoutActive] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);

  const logoutRef = useRef();
  const menuRef = useRef();

  const endDate = new Date(user?.plan?.endDate)
  const now = new Date()
  const isExpired = endDate < now

  const handleLogoutActive = () => {
    setIsLogoutActive(!isLogoutActive);
  };
  const handleMenuActive = () => {
    setIsMenuActive(!isMenuActive);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setIsLogoutActive(false);
      }
    }
    if (isLogoutActive) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isLogoutActive]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuActive(false);
      }
    }
    if (isMenuActive) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isMenuActive]);

  const handleLogout = () => {
    LogoutUser(navigate, accessToken, dispatch);
    googleLogout();
  };

  return (
    <div className="searching__ava">
      <div
        className="searching__ava"
      >
        {
          isExpired ?
            <Link to="/pricing" className='searching__ava__left__upgrade'>
              <span>Nâng cấp Plus</span>
              <i className="fas fa-angle-double-up"></i>
            </Link> :
            <div className='searching__ava__left__info'
              ref={menuRef}
              onClick={handleMenuActive}
            >
              <i className="fa-solid fa-circle-info"></i>
              <div
                className={`searching__ava__list ${isMenuActive ? "active" : ""}`}
                ref={menuRef}
              >
                <div className="searching__ava__list__heading">Thông tin</div>
                <Link
                  to="/info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="searching__ava__list__item"
                >
                  Giới thiệu<i className="fa-solid fa-circle-info"></i>
                </Link>
                <Link
                  to="/info/lien-he"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="searching__ava__list__item"
                >
                  Liên hệ<i className="fa-solid fa-phone"></i>
                </Link>
                <Link
                  to="/info/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="searching__ava__list__item"
                >
                  Điều khoản dịch vụ<i className="fa-solid fa-file-lines"></i>
                </Link>
                <Link
                  to="/info/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="searching__ava__list__item"
                >
                  Chính sách bảo mật<i className="fa-solid fa-shield"></i>
                </Link>
              </div>
            </div>
        }
      </div>
      <div className="searching__ava__right">
        {user?.username ? (
          <div className="searching__ava__right__user">
            <Notifi />
            <div
              className="searching__ava__right__img"
              onClick={handleLogoutActive}
              ref={logoutRef}
            >
              <img src={profile ? profile : ava} alt="Avatar" />
              <div
                className={`searching__ava__list sm ${isLogoutActive ? "active" : ""
                  }`}
                ref={logoutRef}
              >
                <div className="searching__ava__list__heading">Tài khoản</div>
                <Link
                  to={`/user/${user?.username}`}
                  className="searching__ava__list__item"
                >
                  Trang cá nhân<i className="fa-solid fa-user"></i>
                </Link>
                <div
                  className="searching__ava__list__item"
                  onClick={handleLogout}
                >
                  Đăng xuất<i className="fa-solid fa-right-from-bracket"></i>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="searching__ava__right__btn">
            <div className="register__btn">
              <Link to="/register">Đăng ký</Link>
            </div>
            <div className="login__btn">
              <Link to="/login">Đăng nhập</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAva;
