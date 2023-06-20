import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pause } from "../redux/audioSlice";

const Audio = () => {
  const { isPlay } = useSelector((state) => state.audio);
  const audioRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isPlay) {
      audioRef.current.play();
      dispatch(pause());
    }
  }, [isPlay]);

  return <audio src="/click.mp3" ref={audioRef} />;
};

export default Audio;
