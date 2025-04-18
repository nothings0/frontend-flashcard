import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ReactGA from "react-ga4";
import { toggle } from "../redux/themeSlice";
import Admin from "../Admin/Admin";
import Main from "./Main";
import UserRoute from "./UserRoute";
import OtherRoute from "./OtherRoute";
import Toast from "../components/Toast";
import QuizLive from "../pages/QuizLive";
import QuizRoot from "../pages/QuizRoot";
import ChatWidget from "../components/ChatWidget";

const Layout = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { toast } = useSelector((state) => state.toast);

  useEffect(() => {
    const themeMode = localStorage.getItem("themeMode");
    dispatch(toggle(themeMode));
  }, [dispatch]);

  ReactGA.initialize("G-QL0WF8XH3D");

  return (
    <Router>
      <div
        className={`layout ${
          theme === "dark" ? "theme-mode-dark" : "theme-mode-light"
        }`}
      >
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/user/*" element={<UserRoute />} />
          <Route path="/info/*" element={<OtherRoute />} />
          <Route path="/live" element={<QuizLive />} />
          <Route path="/live/:roomId" element={<QuizLive />} />
          <Route path="/:slug/live" element={<QuizRoot />} />
          <Route path="/*" element={<Main />} />
        </Routes>
        {toast && <Toast />}
        <ChatWidget />
      </div>
    </Router>
  );
};

export default Layout;
