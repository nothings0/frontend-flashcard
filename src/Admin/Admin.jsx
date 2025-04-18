import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import AdminDashboard from "./AdminDashboard";
import { useSelector } from "react-redux";
import Service from "./Service";
import Helmet from "../components/Helmet";
import Search from "../components/Search";
import User from "./User";
import Card from "./Card";

const Admin = () => {
  const isAdmin = useSelector((state) => state.user.currentUser?.user.isAdmin);

  return (
    <Helmet title="Admin">
      {
        isAdmin ? <>
          <div className="admin">
            <NavBar />
            <Search />
            <Routes>
              <Route
                path="/"
                element={<AdminDashboard />}
              />
              <Route path="/user" element={<User />} />
              <Route path="/flashcard" element={<Card />} />
              <Route path="/service" element={<Service />} />
            </Routes>
          </div>
        </> :
          <>
            <Navigate to="/login" />
          </>
      }

    </Helmet>
  );
};

export default Admin;
