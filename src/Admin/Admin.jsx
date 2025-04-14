import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import AdminDashboard from "./AdminDashboard";
import { useSelector } from "react-redux";
import CreateAdmin from "./CreateAdmin";
import Service from "./Service";
import Helmet from "../components/Helmet";
import Search from "../components/Search";
import User from "./User";
import Card from "./Card";

const Admin = () => {
  const isAdmin = useSelector((state) => state.user.currentUser?.user.isAdmin);

  return (
    <Helmet title="Admin">
      <div className="admin">
        <NavBar />
        <Search />
        <Routes>
          <Route
            path="/"
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route path="/user" element={<User />} />
          <Route path="/flashcard" element={<Card />} />
          <Route path="/create" element={<CreateAdmin />} />
          <Route path="/service" element={<Service />} />
        </Routes>
      </div>
    </Helmet>
  );
};

export default Admin;
