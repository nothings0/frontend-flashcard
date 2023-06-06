import React from "react";
import { Route, Routes } from "react-router-dom";

import Header from "../components/Header";
import Create from "../pages/Create";
import Detail from "../pages/Detail";
import Edit from "../pages/Edit";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Library from "../pages/Library";
import FlashCard from "../pages/FlashCard";
import Learn from "../pages/Learn";
import Write from "../pages/Write";
import Listen from "../pages/Listen";
import MatchCard from "../pages/MatchCard";
import Home from "../pages/Home";
import Test from "../pages/Test";
import Calendar from "../pages/Calendar";
import AllList from "../pages/AllList";
import NotFound from "../pages/NotFound";
import LyricTraining from "../pages/LyricTraining";
import LyricMain from "../pages/LyricMain";

const Main = () => {
  return (
    <div className="main">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list/:type" element={<AllList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/card/create" element={<Create />} />
        <Route path="/card/edit/:cardId" element={<Edit />} />
        <Route path="/card/:cardId" element={<Detail />} />
        <Route path="/mylibrary" element={<Library />} />
        <Route path="/flashcard/:cardId" element={<FlashCard />} />
        <Route path="/learn/:cardId" element={<Learn />} />
        <Route path="/write/:cardId" element={<Write />} />
        <Route path="/listen/:cardId" element={<Listen />} />
        <Route path="/match/:cardId" element={<MatchCard />} />
        <Route path="/test/:cardId" element={<Test />} />
        <Route path="/lyric" element={<LyricTraining />} />
        <Route path="/lyric/:slug" element={<LyricMain />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default Main;
