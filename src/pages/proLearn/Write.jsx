import React, { useState, useRef, useEffect } from "react";
import { GetMarkWrite } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import InputAnswer from "../../components/InputAnswer";
import { useQueryClient } from "react-query";
import useOnEnter from "../../Hook/useOnEnter";

const Write = ({ data, setStep }) => {
  const audioRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      handlePlay();
    }, 300);
  }, []);

  const [isResult, setIsResult] = useState(false);
  const [result, setResult] = useState({});
  // const [suggestWord, setSuggestWord] = useState("");
  const [answer, setAnswer] = useState("");

  const dispatch = useDispatch();
  const { slug } = useParams();
  const user = useSelector((state) => state.user.currentUser?.user._id);

  // const getSuggestWord = async () => {
  //   const res = await GetSuggestWord({
  //     id: data.ques.term.id,
  //   });
  //   setAnswer("");
  //   setSuggestWord(res.suggest);
  // };

  const handleQues = async () => {
    let ques = {
      answer: answer,
      id: data.ques.term.id,
    };

    const res = await GetMarkWrite(dispatch, slug, ques, user);
    setResult(res);
    setIsResult(true);
  };
  const handlePlay = () => {
    audioRef.current.play();
  };
  const handleEnter = () => {
    if (!isResult) {
      if (answer.length === data.ques.listen?.l) {
        handleQues();
      } else {
        return;
      }
    } else if (isResult) {
      handleNew();
    }
  };
  const handleAnswer = (e) => {
    setAnswer(e.target.value);
  };

  const queryClient = useQueryClient();
  const handleNew = () => {
    queryClient.invalidateQueries({ queryKey: ["data-pro"] });
    setStep(1);
  };

  useOnEnter(() => {
    handleEnter();
  });

  return (
    <div className="pro-write">
      <div className="pro-write__wrap">
        <i className="fa-solid fa-volume-high volumn" onClick={handlePlay}></i>
        <div className="pro-write__container">
          {isResult ? (
            <>
              {result.check ? (
                <p>{result.correctAnswer}</p>
              ) : (
                <>
                  <p>{result.correctAnswer}</p>
                  <div>
                    {answer.split("").map((item, index) => (
                      <span
                        key={index}
                        className={`${
                          result.position.includes(index) ? "incorrect" : ""
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <InputAnswer
              length={data.ques.listen?.l}
              answer={answer}
              setAnswer={handleAnswer}
              // handleEnter={handleEnter}
            />
          )}
        </div>
        {isResult ? (
          <div className="btn-continue active" onClick={handleNew}>
            <span>Tiếp</span>
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        ) : (
          <div className="btn-wrap">
            <div
              className={`btn-continue ${
                answer.length === data.ques.listen?.l ? "" : "active"
              }`}
              onClick={handleQues}
            >
              <span>Bỏ qua</span>
            </div>
            <div
              className={`btn-continue ${
                answer.length === data.ques.listen?.l ? "active" : ""
              }`}
              onClick={handleQues}
            >
              <span>Kiểm tra</span>
            </div>
          </div>
        )}
      </div>
      <audio src={data.ques.audio} ref={audioRef}></audio>
    </div>
  );
};

export default Write;
