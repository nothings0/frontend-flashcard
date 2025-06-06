import React, { useState, useRef, useEffect } from "react";
import { GetMarkLearn } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useOnEnter from "../../Hook/useOnEnter";

const Choice = ({ data, setStep }) => {
  const audioRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      handlePlay();
    }, 200);
  }, []);
  const [isResult, setIsResult] = useState(false);
  const [result, setResult] = useState({});
  const dispatch = useDispatch();
  const { slug } = useParams();
  const user = useSelector((state) => state.user.currentUser?.user._id);
  const handleQues = async (e) => {
    let ques = {
      prompt: data.ques.term.prompt,
      answer: e.target.innerHTML,
      id: data.ques.term.id,
    };
    const res = await GetMarkLearn(dispatch, slug, ques, user);
    setResult(res);
    setIsResult(true);
    // if (res.check) {
    //   handleConfetti();
    // }
  };
  const handlePlay = () => {
    audioRef.current.play();
  };

  const handleEnter = () => {
    if (!isResult) {
      return;
    } else if (isResult) {
      setStep(3);
    }
  };

  useOnEnter(() => {
    handleEnter();
  });

  // const handleConfetti = async () => {
  //   await jsConfetti.addConfetti({
  //     confettiRadius: 4,
  //     confettiColors: [
  //       "#00ffc6",
  //       "#0ffb01",
  //       "#5801f3",
  //       "#ff5722",
  //       "#ff0398",
  //       "#158eff",
  //     ],
  //   });
  //   console.log("aaa");
  //   await jsConfetti.clearCanvas();
  // };
  return (
    <div className="pro-choice">
      <div className="pro-choice__container">
        <div className="pro-choice__answer">
          <div className="pro-choice__answer__wrap">
            {isResult ? (
              <>
                {data.ques.learn.map((item, i) => (
                  <div
                    className={`pro-choice__answer__wrap__item ${
                      result?.correctAnswer === item.answerTxt ? "success" : ""
                    } ${result?.wrongAnswer === item.answerTxt ? "faile" : ""}`}
                    key={i}
                  >
                    {item.answerTxt}
                  </div>
                ))}
              </>
            ) : (
              <>
                {data.ques.learn.map((item, i) => (
                  <div
                    className={`pro-choice__answer__wrap__item`}
                    key={i}
                    onClick={handleQues}
                  >
                    {item.answerTxt}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="pro-choice__icon">
          <i
            className="fa-solid fa-volume-high volumn"
            onClick={handlePlay}
          ></i>

          <div
            className={`btn-continue ${isResult ? "active" : ""}`}
            onClick={() => setStep(3)}
          >
            <i className="fa-solid fa-chevron-right"></i>
            <span>Tiếp</span>
          </div>
        </div>
      </div>
      <audio src={data.ques.audio} ref={audioRef}></audio>
    </div>
  );
};

export default Choice;
