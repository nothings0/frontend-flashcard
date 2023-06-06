import React, { useState } from "react";
import { GetSuggestWord } from "../redux/apiRequest";

const WriteCpn = ({
  handleQues,
  data,
  answer,
  setAnswer,
  isResult,
  handleIndex,
  result,
  subType,
}) => {
  const [suggestWord, setSuggestWord] = useState("");
  const [isSuggest, setSuggest] = useState(false);

  const getSuggestWord = async () => {
    const res = await GetSuggestWord({
      id: data._id,
    });

    setSuggestWord(res.suggest);
    setSuggest(true);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleQues();
    }
  };
  return (
    <div className="write__container">
      <div className="write__top">
        <div className="write__top__define">
          <div className="write__top__prompt">Định nghĩa</div>
        </div>
        <div className="write__top__des">{data?.answer}</div>
      </div>
      {isResult ? (
        <div className="write__middle">
          {result?.check === true ? (
            <div className="write__middle__title correct">Chính xác !</div>
          ) : (
            <div className="write__middle__title incorrect">
              Chưa chính xác !
            </div>
          )}
          <div className="write__middle__item">
            <p>Đáp án đúng</p>
            <h3>{result?.correctAnswer}</h3>
          </div>
          {!result?.check && (
            <>
              {result?.wrongAnswer ? (
                <div className="write__middle__item">
                  <p>Đáp án của bạn</p>
                  <h3>{result?.wrongAnswer}</h3>
                </div>
              ) : (
                <div className="write__middle__item">
                  <p>Bạn không có đáp án</p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="write__suggest">
          {!isSuggest ? (
            <span onClick={getSuggestWord}>Gợi ý</span>
          ) : (
            <span className="write__suggest__word">{suggestWord}</span>
          )}
        </div>
      )}
      <div className="write__bottom">
        {!isResult && (
          <div className="write__bottom__input">
            <textarea
              name="answer"
              maxLength="255"
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
              onKeyDown={handleEnter}
            ></textarea>
            <p>Nhập bằng tiếng anh</p>
          </div>
        )}
        {isResult ? (
          <div
            className="write__bottom__btn"
            onClick={() => {
              handleIndex();
              setSuggest(false);
              setSuggestWord("");
            }}
          >
            Tiếp tục
          </div>
        ) : (
          <div
            className="write__bottom__btn"
            onClick={() => {
              handleQues();
              setSuggest(false);
              setSuggestWord("");
            }}
          >
            {subType ? "Tiếp tục" : "Đáp án"}
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteCpn;
