import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { play } from "../../redux/audioSlice";
import Countdown from "../../components/CountDown";
import RankQuiz from "../QuizRoot/RankQuiz";

const TIME_QUES = 20 * 1000;

const LiveRoot = ({ socket, roomId }) => {
  const [quiz, setQuiz] = useState({});
  const [showCountdown, setShowCountdown] = useState(true);
  const [answer, setAnswer] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [rank, setRank] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Bạn có chắc chắn muốn rời khỏi trang này?";
    };

    // Thêm sự kiện vào window
    window.addEventListener("beforeunload", handleBeforeUnload);
    if (rank.length > 0) {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }
    // Làm sạch: xóa sự kiện khi component bị unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [rank]);

  useEffect(() => {
    // if (showCountdown) {
      // socket.emit("re-get-quiz", roomId);
    // }
    socket.on("quiz", ({ ques, startTime }) => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - new Date(startTime).getTime();
      const remainingTime = TIME_QUES - elapsedTime;
      setStartTime(remainingTime);
      setQuiz(ques);
      setShowCountdown(false);
      setAnswer("");
    });
    socket.on("end-quiz", (rank) => {
      setRank(rank);
      sessionStorage.removeItem("user-live");
    });
    return () => {
      socket.off("get-quiz");
    };
  }, [socket]);

  const handleQues = async (item) => {
    setAnswer(item.answerId);
    dispatch(play());
    let ques = {
      prompt: quiz.prompt,
      answer: item.answerId,
      id: quiz.id,
      roomId,
    };
    socket.emit("get-mark-quiz", ques);
  };

  return (
    <>
      {rank.length > 0 ? (
        <RankQuiz data={rank} />
      ) : (
        <>
          {showCountdown ? (
            <Countdown time={3000} setShowCountdown={setShowCountdown} />
          ) : (
            <div className="wrap">
              <Countdown
                time={startTime}
                setShowCountdown={setShowCountdown}
                type="head"
              />
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
                        <div
                          className={`live-room__answer__wrap ${
                            answer ? "disable" : ""
                          }`}
                        >
                          {quiz.learn.map((item, i) => (
                            <div
                              className={`live-room__answer__wrap__item 
                ${answer === item.answerId ? "selected" : ""}
                `}
                              key={i}
                              onClick={() => handleQues(item)}
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
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LiveRoot;