import React from "react";
import { useSelector } from "react-redux";
import Chart from "./Chart";
import Rank from "./Rank";
import Banner from "./Banner";

const HomeTop = () => {
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  return (
    <div className="home__top">
      {accessToken ? <Chart accessToken={accessToken} /> : <Banner />}
      <Rank />
    </div>
  );
};

export default HomeTop;
