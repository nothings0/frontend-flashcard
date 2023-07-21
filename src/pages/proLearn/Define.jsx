import React, { useRef } from "react";

const Define = ({ data, setStep }) => {
  const audioRef = useRef(null);

  const handleFlip = (e) => {
    e.target.classList.toggle("flip");
  };

  const handlePlay = () => {
    audioRef.current.play();
  };
  return (
    <div className="pro-define">
      <div className="pro-define__main">
        <div className="pro-define__container" onClick={(e) => handleFlip(e)}>
          <div className="pro-define__item front-view">
            <h4>{data.ques.term.prompt}</h4>
            <span>{data.ques.term.mw}</span>
            <p>{data.ques.term.answer}</p>
          </div>
          <div className="pro-define__item back-view">
            <h4>{data.ques.term.def.pt}</h4>
            <p>{data.ques.term.def.an}</p>
          </div>
        </div>
        <i className="fa-solid fa-volume-high volumn" onClick={handlePlay}></i>
        <div className="pro-define__btn" onClick={() => setStep(2)}>
          Tiếp tục
        </div>
      </div>
      <audio src={data.ques.audio} ref={audioRef} autoPlay></audio>
    </div>
  );
};

export default Define;
