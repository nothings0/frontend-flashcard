import React, { useState, memo } from "react";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateIndex } from "../redux/cardSlice";
import { handleSpeech, handleVoice } from "../util/speech";
import { GetUsage } from "../redux/apiRequest";

const FlipCard = ({ data, isVolume, isOpenAI = true }) => {
  const dispatch = useDispatch();
  const index = useSelector((state) => state.card.index);
  const [current, setCurrent] = useState(index);
  const [isActive, setActive] = useState(false);
  const [isAuto, setAuto] = useState(false);
  const [usage, setUsage] = useState([]);
  const length = data?.length;

  const { slug } = useParams();

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
    setCurrent((current) => {
      const index = current === length ? 1 : current + 1;
      if (isVolume) {
        handleVoice(data[index - 1].prompt);
      }
      dispatch(updateIndex(index));
      setActive(false);
      setUsage([]);
      return index;
    });
  };

  const prevSlide = () => {
    let index = current === 1 ? length : current - 1;
    setCurrent(index);
    if (isVolume) {
      handleVoice(data[index - 1].prompt);
    }
    dispatch(updateIndex(index));
    setActive(false);
    setUsage([]);
  };
  //flip card
  const handleFlip = (e) => {
    e.target.classList.toggle("flip");
  };

  const handleAuto = () => {
    setAuto(!isAuto);
  };

  useEffect(() => {
    if (!isAuto) return;
    const card = document.querySelector(".flip-card__table__card.active");
    card.classList.toggle("flip");
    const timeOut = setTimeout(() => {
      nextSlide();
    }, 3500);
    const interval = setInterval(() => {
      const card = document.querySelector(".flip-card__table__card.active");
      card.classList.toggle("flip");
      setTimeout(() => {
        nextSlide();
      }, 3500);
    }, 6000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeOut);
    };
  }, [isAuto]);

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
                        onClick={() => handleVoice(item.prompt)}
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
        <div className="flip-card__control__left" onClick={handleAuto}>
          {!isAuto ? (
            <i className="fa-solid fa-play"></i>
          ) : (
            <i className="fa-solid fa-pause"></i>
          )}
        </div>
        <div className="flip-card__control__middle">
          <i className="fa-solid fa-chevron-left" onClick={prevSlide}></i>
          <span>
            {current > length ? 1 : current}/{length}
          </span>
          <i className="fa-solid fa-chevron-right" onClick={nextSlide}></i>
        </div>
        <div className="flip-card__control__right">
          <Link to={`/flashcard/${slug}`}>
            <i className="fas fa-expand"></i>
          </Link>
        </div>
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
