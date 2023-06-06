import React, { memo } from "react";

const Input = ({ length, answer, handleAnswer, line, sentence, result }) => {
  let style = {
    width: `${length * 1.5}ch`,
    background: `repeating-linear-gradient(90deg, 
      dimgrey 0, dimgrey 1ch, 
      transparent 0, transparent 1.5ch) 
      0 100%/ ${1.5 * length - 0.5}ch 2px no-repeat`,
  };
  return (
    <input
      type="text"
      maxLength={length}
      className={`inputss ${
        result !== undefined ? (result.result ? "true" : "false") : ""
      }`}
      value={answer}
      onChange={(e) => handleAnswer(e, line, sentence)}
      style={style}
    />
  );
};

export default memo(Input);
