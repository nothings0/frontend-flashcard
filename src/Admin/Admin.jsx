import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import AdminDashboard from "./AdminDashboard";
import { useSelector } from "react-redux";
import Service from "./Service";
import Helmet from "../components/Helmet";
import Search from "../components/Search";
import User from "./User";
import Card from "./Card";
import AdminWithdrawal from "./Withdraw";
import { useEffect } from "react";

const Admin = () => {
  const isAdmin = useSelector((state) => state.user.currentUser?.user.isAdmin);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin]);

  return (
    <Helmet title="Admin">
      <div className="admin">
        <NavBar />
        <Search />
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/flashcard" element={<Card />} />
          <Route path="/withdraw" element={<AdminWithdrawal />} />
          <Route path="/service" element={<Service />} />
        </Routes>
      </div>
    </Helmet>
  );
};

export default Admin;
