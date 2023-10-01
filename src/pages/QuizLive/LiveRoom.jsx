import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const LiveRoom = ({ socket, roomId }) => {
  const [quiz, setQuiz] = useState({});
  const userId = useSelector((state) => state.user.currentUser?.user._id);
  const { slug } = useParams();

  useEffect(() => {
    socket?.on("quiz", (quiz) => {
      setQuiz(quiz);
    });
    return () => {
      socket.off("quiz");
    };
  }, [socket]);

  const handleQues = async (e) => {
    let ques = {
      prompt: quiz.prompt,
      answer: e.target.innerHTML,
      id: quiz._id,
    };
    socket.emit("get-mark-quiz", ques);
    socket.emit("create-quiz", { user: userId, slug, roomId });
  };

  return (
    <>
      {quiz?.learn && (
        <div className="live-room__wrap">
          <div className="live-room">
            <div className="live-room__container">
              <div className="live-room__question">
                <h4>Định nghĩa</h4>
                <p>{quiz.prompt}</p>
              </div>
              <div className="live-room__answer">
                <div className="live-room__answer__title">
                  Chọn thuật ngữ đúng
                </div>
                <div className="live-room__answer__wrap">
                  {quiz.learn.map((item, i) => (
                    <div
                      className={`live-room__answer__wrap__item 
                
                `}
                      key={i}
                      onClick={handleQues}
                    >
                      {item.answerTxt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveRoom;
