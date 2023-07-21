import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderChild from "./HeaderChild";
import LineProgress from "./LineProgress";

const HeaderPrimary = ({ value, length, round, title }) => {
  const navigate = useNavigate();
  return (
    <div className="header-primary">
      {value !== undefined && <LineProgress value={value} length={length} />}
      <div className="card-detail__header__title shrink">
        <div className="header-primary__title">
          <div className="searching__control" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-angle-left"></i>
            <span>Quay lại</span>
          </div>
          <h3>{title}</h3>
        </div>
        {round && <div className="header-primary__round">Vòng {round}</div>}
        <HeaderChild />
      </div>
    </div>
  );
};

export default HeaderPrimary;
