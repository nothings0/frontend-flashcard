import React from "react";
import { Link, useParams } from "react-router-dom";

const RankQuiz = ({ data }) => {
  const { slug } = useParams();
  return (
    <div className="rank-quiz">
      <div className="rank-quiz__wrap">
        {data.map((item, index) => (
          <div className="rank-quiz__item" key={index}>
            <div className="rank-quiz__index">{index + 1}</div>
            <div className="rank-quiz__name">{item.name}</div>
            <div className="rank-quiz__mark">{item.totalMark}</div>
          </div>
        ))}
      </div>
      <div className="rank-quiz__btn">
        <Link to={`/card/${slug}`}>Return</Link>
      </div>
    </div>
  );
};

export default RankQuiz;
