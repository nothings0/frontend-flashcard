import React from "react";
import { Link } from "react-router-dom";
import { AddView } from "../redux/apiRequest";
import { nFormatter } from "../util";

const Card = ({ data, flex }) => {
  const Recent = () => {
    let recentArr = JSON.parse(localStorage.getItem("recent"));
    if (recentArr === null) recentArr = [];
    if (
      recentArr.length === 0 ||
      recentArr.every((item) => item._id !== data._id)
    ) {
      if (recentArr.length === 8) {
        recentArr.pop();
      }
      recentArr.unshift(data);
      localStorage.setItem("recent", JSON.stringify(recentArr));
    }
  };

  const addView = () => {
    AddView(data.slug);
    Recent();
  };

  return (
    <div className={`card ${flex ? "flex" : ""}`} onClick={addView}>
      <Link to={`/card/${data?.slug}`}>
        <div
          className="card__des"
          style={{ background: `${data?.background}` }}
        >
          <h3>{data?.title}</h3>
          <button>Xem học phần</button>
          <i className="fa-solid fa-gem"></i>
        </div>
      </Link>
      <div className="card__txt">
        <Link to={`/card/${data?.slug}`}>
          <div className="card__title">{data?.title}</div>
        </Link>
        <div className="card__info">
          {flex ? (
            <p>{data?.description}</p>
          ) : (
            <p>{nFormatter(data?.views, 1)} Lượt học</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
