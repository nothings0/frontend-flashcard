import { useState } from "react";
import { handleSpeech } from "../util/speech";
import InputAnswer from "./InputAnswer.jsx";

const ListenCpn = ({
  handleQues,
  data,
  setAnswer,
  answer,
  isResult,
  handleIndex,
  result,
  subType,
}) => {
  const [isShow, setShow] = useState(false);
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleQues();
    }
  };
  const handleChange = (e) => {
    setAnswer(e.target.value);
  };
  return (
    <div className="listen__container">
      <div className="listen__top">
        <div className="listen__top__define">
          <div className="listen__top__define__title">
            Ấn vào loa để nghe
            <i
              className="fa-solid fa-volume-high"
              onClick={() => handleSpeech(data?.prompt)}
            ></i>
          </div>
          <div className="listen__top__define__alert">
            <i className="fa-solid fa-circle-exclamation"></i>
            <div className="listen__top__define__alert__popup">
              Chức năng này có thể không hoạt động trên một số trình duyệt. Vui
              lòng truy cập trên trình duyệt Chrome để có trải nghiệm tốt nhất
            </div>
          </div>
        </div>
      </div>
      {isResult ? (
        <div className="listen__middle">
          {result?.check === true ? (
            <div className="listen__middle__title correct">Chính xác !</div>
          ) : (
            <div className="listen__middle__title incorrect">
              Chưa chính xác !
            </div>
          )}
          <div className="listen__middle__item">
            <p>Đáp án đúng</p>
            <h3>{result?.correctAnswer}</h3>
          </div>
          {!result?.check && (
            <>
              {result?.wrongAnswer ? (
                <div className="listen__middle__item">
                  <p>Đáp án của bạn</p>
                  <h3>{result?.wrongAnswer}</h3>
                </div>
              ) : (
                <div className="listen__middle__item">
                  <p>Bạn không có đáp án</p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="listen__suggest" onClick={() => setShow(!isShow)}>
          <span>{!isShow ? "Xem định nghĩa" : data.answer}</span>
        </div>
      )}
      <div className="listen__bottom">
        {!isResult && (
          <div className="listen__bottom__input">
            <InputAnswer
              length={data?.l}
              answer={answer}
              setAnswer={handleChange}
              handleEnter={handleEnter}
            />
            <p>Nhập bằng tiếng anh</p>
          </div>
        )}
        {isResult ? (
          <div
            className="listen__bottom__btn"
            onClick={() => {
              handleIndex();
              setShow(false);
            }}
          >
            Tiếp tục
          </div>
        ) : (
          <div
            className="listen__bottom__btn"
            onClick={() => {
              handleQues();
              setShow(false);
            }}
          >
            {subType ? "Tiếp tục" : "Đáp án"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListenCpn;
