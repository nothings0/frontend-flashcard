import {useState, useRef, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom'
import { useNavigate } from "react-router-dom";

import SearchInput from './SearchInput';
import SearchAva from './SearchAva';
import { useDispatch, useSelector } from 'react-redux';
import { LogoutUser } from '../redux/apiRequest';
import Notifi from './Notifi';
import { googleLogout } from '@react-oauth/google'
import logo from "../assets/logo.png"
const ava = require("../assets/ava1.png")

const mainNav = [
  {
      display: "Home",
      path: "/",
      icon: "fa-solid fa-house"
  },
  {
      display: "Thư viện",
      path: "/mylibrary",
      icon: "fa-solid fa-book"
  },
  {
      display: "Calendar",
      path: "/calendar",
      icon: "fa-brands fa-hive"
  },
  {
      display: "Tạo",
      path: "/card/create",
      icon: "fa-solid fa-plus"
  },
  {
      display: "Lyric training",
      path: "/lyric",
      icon: "fa-solid fa-music"
  }
]

const Search = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const currentUser = useSelector(state => state.user.currentUser?.user)
  const activeNav = mainNav.findIndex(e => e.path === pathname)
  const accessToken = useSelector(state => state.user.currentUser?.accessToken)
  const dispatch = useDispatch()
  const [activeMenu, setActiveMenu] = useState(false)
  const menuRef = useRef()

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(false)
      }
    }
    if(activeMenu){
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    }
  }, [activeMenu])

  const handleMenuActive = () => {
    setActiveMenu(!activeMenu)
  }
  const handleLogout = () => {
    LogoutUser(navigate, accessToken, dispatch)
    googleLogout()
  }
  return (
    <div className="searching">
      <div className="searching__logo">
        <Link to="/">
          <img srcSet={`${logo} 2x`} alt="logo" />
        </Link>
        {
          pathname === '/' ? 
          <h4>Học tập không giới hạn</h4> : 
          <div className="searching__control" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-angle-left"></i>
            <span>Quay lại</span>
          </div>
        }
      </div>
      {
        activeMenu ? 
        <div className={`searching__menu ${activeMenu ? 'active' : ''}`}>
          <div className="searching__menu__wrap" ref={menuRef} onClick={handleMenuActive}>
            <div className="searching__menu__user">
              {
                currentUser?.username ?
                <>
                  <div className="searching__menu__user__img">
                    <img src={currentUser.profilePic || ava} alt="Avatar" />
                    <h4>{currentUser.name || currentUser.username}</h4>
                  </div>
                  <div className="searching__menu__user__info">
                    <Link to={`/user/${currentUser.username}`}><i className="fa-solid fa-user"></i>Trang cá nhân</Link>
                    <h4 onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i>Đăng xuất</h4>
                  </div>
                </> : <>
                  <Link to={`/login`} className="searching__menu__user__login"><i className="fa-solid fa-right-to-bracket"></i>Đăng nhập</Link>
                </>
              }
            </div>
            <div className="searching__menu__link">
            {
              mainNav.map((item, index) => {
                if((item.display === "Tạo" || item.display === "Calendar" || item.display === "Thư viện") && !currentUser?.username){
                  return (
                    <div className={`searching__menu__link__item ${index === activeNav ? 'active' : ''}`} key={index}>
                      <Link to='/login'>
                        <i className={item.icon}></i>
                        {item.display}
                      </Link>
                    </div>
                  )
                }
                return (
                <div className={`searching__menu__link__item ${index === activeNav ? 'active' : ''}`} key={index}>
                  <Link to={item.path}>
                    <i className={item.icon}></i>
                    {item.display}
                  </Link>
                </div>
              )})
            }
            </div>
          </div>
        </div> : <div className="searching__menu__icon" onClick={() => setActiveMenu(true)}><i className="fa-solid fa-bars"></i></div>
      }
      <SearchInput/>
      <SearchAva/>
      {
        currentUser && <div className="searching__right">
        <Notifi />
      </div>
      }
    </div>
  )
};

export default Search;
