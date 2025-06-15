import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toggle } from "../redux/themeSlice";

const mainNav = [
  {
    display: "Trang chủ",
    path: "/",
    icon: "fa-solid fa-house",
  },
  {
    display: "Thư viện",
    path: "/mylibrary",
    icon: "fa-solid fa-book",
  },
  {
    display: "Lịch học",
    path: "/calendar",
    icon: "fa-brands fa-hive",
  },
  {
      display: "Flux AI",
      path: "/chat-ai",
      icon: "fa-solid fa-robot"
  },
  {
    display: "Tạo",
    path: "/card/create",
    icon: "fa-solid fa-plus",
  },
  // {
  //   display: "Lyric training",
  //   path: "/lyric",
  //   icon: "fa-solid fa-music",
  // },
];

const Header = () => {
  const { pathname } = useLocation();
  const activeNav = mainNav.findIndex((e) => e.path === pathname);
  const [isDark, setIsDark] = useState(false);

  const currentUser = useSelector(
    (state) => state.user.currentUser?.user.username
  );
  const themeMode = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    if (themeMode === "light" || themeMode === null) setIsDark(false);
    else setIsDark(true);
  }, []);

  const handleTheme = () => {
    let theme = isDark;
    setIsDark(!theme);
    const themeMode = theme ? "light" : "dark";
    localStorage.setItem("themeMode", themeMode);
    dispatch(toggle(themeMode));
  };

  return (
    <div className="header">
      <div className="header__link">
        {mainNav.map((item, index) => {
          if (
            (item.display === "Tạo" ||
              item.display === "Calendar" ||
              item.display === "Thư viện") &&
            !currentUser
          ) {
            return (
              <div
                className={`header__link__item ${
                  index === activeNav ? "active" : ""
                }`}
                key={index}
              >
                <Link to="/login">
                  <i className={item.icon}></i>
                  {item.display}
                </Link>
              </div>
            );
          }
          return (
            <div
              className={`header__link__item ${
                index === activeNav ? "active" : ""
              }`}
              key={index}
            >
              <Link to={item.path}>
                <i className={item.icon}></i>
                {item.display}
              </Link>
            </div>
          );
        })}
      </div>
      <div className="header__link">
        <div className="header__link__mode">
          {!isDark ? (
            <i className="fa-solid fa-moon" onClick={handleTheme}></i>
          ) : (
            <i className="fa-solid fa-sun" onClick={handleTheme}></i>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
