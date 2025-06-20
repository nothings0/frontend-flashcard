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
import ScrollToTop from "../components/ScrollToTop";
import { syncUserToLocal } from "../util";
import Skeleton from "../components/Skeleton";

const Layout = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { toast } = useSelector((state) => state.toast);
  const user = useSelector((state) => state.user.currentUser);
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    const themeMode = localStorage.getItem("themeMode");
    dispatch(toggle(themeMode));
  }, [dispatch]);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("accessToken"));

    if (token && !user) {
      syncUserToLocal(token, dispatch);
    }
  }, []);

  ReactGA.initialize("G-QL0WF8XH3D");

  return (
    <Router>
      <div
        className={`layout ${
          theme === "dark" ? "theme-mode-dark" : "theme-mode-light"
        }`}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <Routes>
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/user/*" element={<UserRoute />} />
              <Route path="/info/*" element={<OtherRoute />} />
              <Route path="/live" element={<QuizLive />} />
              <Route path="/live/:roomId" element={<QuizLive />} />
              <Route path="/:slug/live" element={<QuizRoot />} />
              <Route path="/*" element={<Main />} />
            </Routes>
          </>
        )}

        {toast && <Toast />}
        <ChatWidget />
        <ScrollToTop />
      </div>
    </Router>
  );
};

export default Layout;
