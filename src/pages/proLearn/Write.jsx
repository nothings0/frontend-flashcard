import React, { useState, useRef, useEffect } from "react";
import {
  GetMarkLearn,
  GetMarkWrite,
  GetSuggestWord,
} from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import InputAnswer from "../../components/InputAnswer";

const Write = ({ data, setStep }) => {
  const audioRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      handlePlay();
    }, 300);
  }, []);

  const [isResult, setIsResult] = useState(false);
  const [result, setResult] = useState({});
  const [suggestWord, setSuggestWord] = useState("");
  const [answer, setAnswer] = useState("");

  const dispatch = useDispatch();
  const { slug } = useParams();
  const user = useSelector((state) => state.user.currentUser?.user._id);

  const getSuggestWord = async () => {
    const res = await GetSuggestWord({
      id: data.ques.term.id,
    });
    setAnswer("");
    setSuggestWord(res.suggest);
  };

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
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleQues();
    }
  };
  const handleAnswer = (e) => {
    setAnswer(e.target.value);
  };
  return (
    <div className="pro-write">
      <div className="pro-write__wrap">
        <i className="fa-solid fa-volume-high volumn" onClick={handlePlay}></i>
        <div className="pro-write__container">
          <InputAnswer
            //   length={data.ques.listen?.l}
            length={8}
            answer={answer}
            setAnswer={handleAnswer}
            handleEnter={handleEnter}
            hint={suggestWord}
          />
        </div>
        {isResult ? (
          <div className="btn-continue" onClick={() => setStep(3)}>
            <span>Tiếp</span>
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        ) : (
          <div className="btn-continue" onClick={handleQues}>
            <span>Kiểm tra</span>
          </div>
        )}
      </div>
      <audio src={data.ques.audio} ref={audioRef}></audio>
    </div>
  );
};

export default Write;
