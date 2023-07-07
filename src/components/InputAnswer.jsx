import React from "react";

const InputAnswer = ({ length, answer, setAnswer, handleEnter, hint }) => {
  let style = {
    border: "none",
    width: `${length * 1.5}ch`,
    background: `repeating-linear-gradient(90deg, 
        black 0, 
        black 1ch, 
        transparent 0, 
        transparent 1.5ch) 
      0 100%/100% 2px no-repeat`,
    font: `5ch consolas, monospace`,
    letterSpacing: `.5ch`,
    marginBottom: "15px",
  };
  return (
    <div className="input-answer">
      <input
        type="text"
        maxLength={length}
        value={answer}
        onChange={(e) => setAnswer(e)}
        style={style}
        onKeyDown={handleEnter}
      />
      <div className="input-answer__layer" style={style}>
        {hint}
      </div>
    </div>
  );
};

export default InputAnswer;
