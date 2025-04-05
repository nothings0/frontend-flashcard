import React, { memo, useEffect, useRef } from "react";

const Input = ({
  length,
  answer,
  handleAnswer,
  line,
  sentence,
  result,
  active,
  sTime,
  eTime,
  playerRef,
  setIsPlaying,
  currentTime,
}) => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (active) inputRef.current.focus();
    else {
      if (answer.length < length && eTime <= currentTime * 1000) {
        // playerRef?.current?.seekTo(sTime / 1000);
        // setIsPlaying(false);
      }
    }
  }, [active]);

  const handlePlay = (e) => {
    // if (e.target.value.length === length) {
    // }
    setIsPlaying(true);
  };

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
      onChange={(e) => {
        handleAnswer(e, line, sentence);
        handlePlay(e);
      }}
      style={style}
      ref={inputRef}
    />
  );
};

export default memo(Input);
