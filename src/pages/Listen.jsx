import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../components/Modal";
import { GetListen, GetMarkListen } from "../redux/apiRequest";
import Search from "../components/Search";
import ListenCpn from "../components/ListenCpn";
import Helmet from "../components/Helmet";
import Skeleton from "../components/Skeleton";
import HeaderPrimary from "../components/HeaderPrimary";
import { play } from "../redux/audioSlice";

const Listen = () => {
  const { slug } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.middle);
  const user = useSelector((state) => state.user.currentUser?.user._id);

  const [index, setIndex] = useState(0);
  const [mark, setMark] = useState(0);
  const [result, setResult] = useState({});
  const [isResult, setIsResult] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [answer, setAnswer] = useState("");

  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(1);
  const [round, setRound] = useState(0);

  const getData = async (slug) => {
    const res = await GetListen(dispatch, slug, user, 10);
    if (res?.length === 0) {
      setModalType(2);
      setModalOpen(true);
    } else {
      setData(res);
      setRound((round) => round + 1);
    }
  };
  useEffect(() => {
    getData(slug);
  }, [slug]);

  const handleIndex = () => {
    dispatch(play());
    let nextIndex = index + 1;
    if (nextIndex < data.question.length) {
      setIndex(nextIndex);
      setResult({});
      setIsResult(false);
      setAnswer("");
    } else {
      setModalOpen(true);
    }
  };
  const handleQues = async () => {
    let ques = {
      answer: answer,
      id: data.question[index]._id,
    };

    const res = await GetMarkListen(dispatch, slug, ques, user);
    setResult(res);
    setIsResult(true);
    if (res.check === true) {
      let Imark = mark + 1;
      setMark(Imark);
    }
  };

  const handleNextQuestion = () => {
    getData(slug);
    setResult({});
    setIsResult(false);
    setIndex(0);
    setModalOpen(false);
    setMark(0);
  };

  const handleReLearn = () => {
    setResult({});
    setIsResult(false);
    setIndex(0);
    setModalOpen(false);
    setMark(0);
  };

  return (
    <Helmet title="Luyện nghe | Flux">
      <div className="listen">
        <Search />
        <HeaderPrimary
          value={index}
          length={data.question?.length}
          round={round}
          title="Luyện nghe"
        />
        <ListenCpn
          subType={true}
          handleQues={handleQues}
          data={data.question[index]}
          setAnswer={setAnswer}
          answer={answer}
          isResult={isResult}
          handleIndex={handleIndex}
          result={result}
          lang={data.lang}
        />
        {modalOpen && (
          <Modal modalOpen={modalOpen}>
            <ModalTitle>
              <h4>Kết quả</h4>
              <i className="fa-solid fa-xmark"></i>
            </ModalTitle>
            <ModalBody>
              <p>
                Bạn trả lời đúng {mark}/{data.question.length}
              </p>
            </ModalBody>
            <ModalFooter>
              <button className="cancel-btn" onClick={handleReLearn}>
                Học lại
              </button>
              <button className="ok-btn" onClick={handleNextQuestion}>
                tiếp tục
              </button>
            </ModalFooter>
          </Modal>
        )}
        {modalOpen && modalType === 2 && (
          <Modal modalOpen={modalOpen}>
            <ModalTitle setModalOpen={setModalOpen}>
              <h4>Chúc mừng</h4>
            </ModalTitle>
            <ModalBody>
              <p>Chúc mừng bạn đã hoàn thành học phần này</p>
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

export default Listen;
