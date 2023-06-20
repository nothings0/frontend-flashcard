import React from "react";

const LearnCpn = ({ handleQues, question, isResult, result, answerArr }) => {
  return (
    <>
      {question && (
        <>
          <div className="learn__container">
            <div className="learn__question">
              <h4>Định nghĩa</h4>
              <p>{question.prompt}</p>
            </div>
            <div className="learn__answer">
              <div className="learn__answer__title">Chọn thuật ngữ đúng</div>
              <div className="learn__answer__wrap">
                {isResult ? (
                  <>
                    {question.answer.map((item, i) => (
                      <div
                        className={`learn__answer__wrap__item ${
                          result?.correctAnswer === item.answerTxt
                            ? "success"
                            : ""
                        } ${
                          result?.wrongAnswer === item.answerTxt ? "faile" : ""
                        }`}
                        key={i}
                      >
                        {item.answerTxt}
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {question.answer.map((item, i) => (
                      <div
                        className={`learn__answer__wrap__item ${
                          item.answerTxt === answerArr?.answer ? "selected" : ""
                        }`}
                        key={i}
                        onClick={handleQues}
                      >
                        {item.answerTxt}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LearnCpn;
