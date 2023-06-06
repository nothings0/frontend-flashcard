import React, { useState, memo } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateIndex } from "../redux/cardSlice";
import { handleSpeech } from "../util/speech";
import { GetUsage } from "../redux/apiRequest";

const FlipCard = ({ data, setProgess, isVolume, isOpenAI = true }) => {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(
    useSelector((state) => state.card.index)
  );
  const [isActive, setActive] = useState(false);
  const [usage, setUsage] = useState([]);
  const length = data?.length;

  useEffect(() => {
    let index = current > length ? 1 : current;
    setCurrent(index);
  }, []);

  const handleOpenAi = async () => {
    setActive(true);
    const res = await GetUsage(data[current - 1].prompt);
    setUsage(res.bot.split("\n"));
  };

  const nextSlide = () => {
    let index = current === length ? 1 : current + 1;
    setCurrent(index);
    if (isVolume) {
      handleSpeech(data[index - 1].prompt);
    }
    if (setProgess) {
      setProgess(index);
    }
    dispatch(updateIndex(index));
    setActive(false);
    setUsage([]);
  };

  const prevSlide = () => {
    let index = current === 1 ? length : current - 1;
    setCurrent(index);
    if (isVolume) {
      handleSpeech(data[index - 1].prompt);
    }
    if (setProgess) {
      setProgess(index);
    }
    dispatch(updateIndex(index));
    setActive(false);
    setUsage([]);
  };
  //flip card
  const handleFlip = (e) => {
    e.target.classList.toggle("flip");
  };
  return (
    <div className="flip-card">
      <div className="flip-card__table">
        {data &&
          data.map((item, index) => {
            let position = "";
            let iCurrent = current > length ? 1 : current;
            if (index === iCurrent - 1) {
              position = "active";
            } else if (index <= iCurrent - 2) {
              position = "lastSlide";
            } else if (index >= iCurrent) {
              position = "nextSlide";
            }
            return (
              <div
                className={`flip-card__table__card ${position}`}
                key={index}
                onClick={(e) => handleFlip(e)}
              >
                <div className={`flip-card__table__item front-view`}>
                  <span>{item.prompt}</span>
                  {isVolume && (
                    <div className="flip-card__table__card__icon">
                      <i
                        className={`fa-solid fa-volume-high`}
                        onClick={() => handleSpeech(item.prompt)}
                      ></i>
                    </div>
                  )}
                </div>
                <div className={`flip-card__table__item back-view`}>
                  {item.answer}
                </div>
              </div>
            );
          })}
      </div>
      <div className="flip-card__control">
        <i className="fa-solid fa-chevron-left" onClick={prevSlide}></i>
        <span>
          {current > length ? 1 : current}/{length}
        </span>
        <i className="fa-solid fa-chevron-right" onClick={nextSlide}></i>
      </div>
      {isOpenAI && (
        <div className="flip-card__usage">
          {!isActive ? (
            <button onClick={handleOpenAi}>Cách dùng</button>
          ) : (
            <div className="">
              {usage.length > 0 &&
                usage.map((item, index) => <p key={index}>{item}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(FlipCard);
