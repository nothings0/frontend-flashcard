import React from "react";
import ava from "../../assets/ava1.png";

const QuizUser = ({ user }) => {
  return (
    <div className="quiz__user">
      <div className="quiz__user--img">
        <img src={ava} alt="avatar user" />
      </div>
      <div className="quiz__user--text">{user.name}</div>
    </div>
  );
};

export default QuizUser;
