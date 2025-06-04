import React, { useRef } from "react";
import useOnEnter from "../../Hook/useOnEnter";

const Define = ({ data, setStep }) => {
  const audioRef = useRef(null);

  const handleFlip = (e) => {
    e.target.classList.toggle("flip");
  };

  const handlePlay = () => {
    audioRef.current.play();
  };

  useOnEnter(() => {
    const card = document.querySelector(".pro-define__container");
    card.classList.toggle("flip");
    setTimeout(() => {
      setStep(2);
    }, 2500);
    // clearTimeout(timeOut);
  });

  return (
    <div className="pro-define">
      <div className="pro-define__main">
        <div className="pro-define__container" onClick={(e) => handleFlip(e)}>
          <div className="pro-define__item front-view">
            <h4>{data.ques.term.prompt}</h4>
          </div>
          <div className="pro-define__item back-view">
            <h4>{data.ques.term.answer}</h4>
          </div>
        </div>
        <i className="fa-solid fa-volume-high volumn" onClick={handlePlay}></i>
        <div className="pro-define__btn" onClick={() => setStep(2)}>
          Tiếp tục
        </div>
      </div>
      <audio src={data.ques.audio} ref={audioRef}></audio>
    </div>
  );
};

export default Define;
