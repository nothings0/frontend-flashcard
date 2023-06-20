import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetTestSpaceRep, GetMarkTest } from "../redux/apiRequest";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../components/Modal";
import LearnCpn from "../components/LearnCpn";
import ListenCpn from "../components/ListenCpn";
import WriteCpn from "../components/WriteCpn";
import Helmet from "../components/Helmet";
import Skeleton from "../components/Skeleton";
import HeaderPrimary from "../components/HeaderPrimary";
import { play } from "../redux/audioSlice";

const SpaceRep = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.middle);
  const { accessToken } = useSelector((state) => state.user.currentUser);
  const user = useSelector((state) => state.user.currentUser?.user._id);
  //   mang cau hoi
  const [question, setQuestion] = useState([]);
  const [result, setResult] = useState([]);
  const [isResult, setIsResult] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answerArr, setAnswerArr] = useState([]);
  const [index, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [round, setRound] = useState(0);

  const getQuestion = async () => {
    const res = await GetTestSpaceRep(dispatch, accessToken, 10);
    if (res.question.length === 0) {
      setModalOpen(true);
    } else {
      setRound((round) => round + 1);
      setQuestion(res.question);
      let initState = [];
      for (let i = 0; i < res.question.length; i++) {
        let newObj = {
          _id: res.question[i]._id,
          answer: "",
          type: res.question[i].type,
          card: res.question[i].card,
        };
        initState.push(newObj);
      }
      setAnswerArr(initState);
    }
  };
  useEffect(() => {
    getQuestion();
  }, []);

  const handleIndex = () => {
    dispatch(play());
    let nextIndex = index + 1;
    if (nextIndex < question.length) {
      setIndex(nextIndex);
      setAnswer("");
    } else {
      handleSubmit();
    }
  };
  const handleQues = (e) => {
    const newArr = [...answerArr];
    newArr[index].answer =
      question[index].type === 1 || question[index].type === "learn"
        ? e.target.innerHTML
        : answer;
    newArr[index].type = question[index].type;
    setAnswerArr(newArr);
    let nextIndex = index + 1;
    if (nextIndex < question.length) {
      setIndex(nextIndex);
      setAnswer("");
    } else {
      handleSubmit();
    }
  };
  const handleChangeQues = (idx) => {
    dispatch(play());
    setIndex(idx);
  };
  const handleSubmit = async () => {
    if (isSubmit) {
      handleNextQuestion();
    } else {
      const res = await GetMarkTest(dispatch, answerArr, user);
      setResult(res);
      setIsResult(true);
      setIsSubmit(true);
      setIndex(0);
    }
  };
  const handleNextQuestion = () => {
    getQuestion();
    setResult({});
    setIsResult(false);
    setIndex(0);
    setIsSubmit(false);
    setAnswerArr([]);
    setAnswer("");
  };

  return (
    <Helmet title="Kiểm tra | Flux">
      <div className="test">
        <HeaderPrimary
          value={index}
          length={question?.length}
          round={round}
          title="Kiểm tra"
        />
        <div className="test__container">
          <TestContainer
            question={question[index]}
            setAnswer={setAnswer}
            answer={answer}
            handleQues={handleQues}
            isSubmit={isSubmit}
            result={result[index]}
            isResult={isResult}
            handleIndex={handleIndex}
            answerArr={answerArr}
            index={index}
          />
        </div>
        <div className="test__bottom">
          <div className="test__nums">
            {question.map((i, idx) => (
              <div
                className={`test__nums__item ${index === idx ? "active" : ""} ${
                  isSubmit
                    ? result[idx].check === false
                      ? "false"
                      : "true"
                    : ""
                }`}
                key={idx}
                onClick={() => handleChangeQues(idx)}
              >
                {idx + 1}
              </div>
            ))}
          </div>
          {isSubmit ? (
            <div className="test__submit" onClick={handleNextQuestion}>
              Tiếp tục
            </div>
          ) : (
            <div className="test__submit" onClick={handleSubmit}>
              Nộp bài
            </div>
          )}
        </div>
        {modalOpen && (
          <Modal modalOpen={modalOpen}>
            <ModalTitle setModalOpen={setModalOpen}>
              <h4>Đã ôn tập hết</h4>
            </ModalTitle>
            <ModalBody>
              <p>Bạn đã ôn tập hết học phần này, hãy quay lại sau</p>
            </ModalBody>
            <ModalFooter>
              <button className="ok-btn" onClick={() => navigate(-1)}>
                Quay lại
              </button>
            </ModalFooter>
          </Modal>
        )}
        {loading && <Skeleton />}
      </div>
    </Helmet>
  );
};

const TestContainer = ({
  question,
  setAnswer,
  answer,
  isResult,
  handleQues,
  isSubmit,
  result,
  handleIndex,
  answerArr,
  index,
}) => {
  if (isSubmit) {
    if (question?.type === "learn") {
      return (
        <LearnCpn
          handleQues={handleQues}
          question={question}
          isResult={isResult}
          result={result}
        />
      );
    } else if (question?.type === "listen") {
      return (
        <ListenCpn
          handleQues={handleQues}
          data={question}
          setAnswer={setAnswer}
          answer={answer}
          isResult={isResult}
          handleIndex={handleIndex}
          result={result}
        />
      );
    } else {
      return (
        <WriteCpn
          handleQues={handleQues}
          data={question}
          setAnswer={setAnswer}
          answer={answer}
          isResult={isResult}
          handleIndex={handleIndex}
          result={result}
        />
      );
    }
  } else {
    if (question?.type === "learn") {
      return (
        <LearnCpn
          handleQues={handleQues}
          question={question}
          isResult={isResult}
          answerArr={answerArr[index]}
        />
      );
    } else if (question?.type === "listen") {
      return (
        <ListenCpn
          subType={true}
          handleQues={handleQues}
          data={question}
          setAnswer={setAnswer}
          answer={answer || answerArr[index]?.answer}
        />
      );
    } else {
      return (
        <WriteCpn
          subType={true}
          handleQues={handleQues}
          data={question}
          setAnswer={setAnswer}
          answer={answer || answerArr[index]?.answer}
        />
      );
    }
  }
};

export default SpaceRep;
