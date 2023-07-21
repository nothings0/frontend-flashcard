import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../components/Modal";
import { flipCard } from "../util/flipCard";
import Helmet from "../components/Helmet";
import {
  GetMatchCard,
  UpdateAndGetMatch,
  UpdateMardMatchCard,
} from "../redux/apiRequest";
import Skeleton from "../components/Skeleton";
import HeaderPrimary from "../components/HeaderPrimary";
import { play } from "../redux/audioSlice";

const MatchCard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { slug } = useParams();
  const { loading } = useSelector((state) => state.middle);
  const user = useSelector((state) => state.user.currentUser?.user._id);

  const [data, setData] = useState([]);
  const [terms, setTerms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(1);
  const [round, setRound] = useState(0);

  const getData = async (slug) => {
    const res = await GetMatchCard(dispatch, slug, user, 8);
    setData(res);
    setTerms(res.terms);
    if (res?.terms.length < 8) {
      setModalOpen(true);
      setModalType(1);
    }
  };
  useEffect(() => {
    getData(slug);
  }, [slug]);

  const handleUpdate = () => {
    UpdateMardMatchCard(slug, user, terms);
  };
  const handleUpdateAndGet = async () => {
    const res = await UpdateAndGetMatch(slug, user, terms, 8);
    setTerms(res.terms);
  };

  const handleClick = (e) => {
    dispatch(play());
    flipCard(e, setModalType, setModalOpen, handleUpdate, dispatch);
  };

  return (
    <Helmet title="Ghép thẻ | Flux">
      <div className="match">
        <HeaderPrimary round={round} title="Ghép thẻ" />
        <div className="cards">
          {terms?.map((item, index) => (
            <div className="cardz" key={index} onClick={(e) => handleClick(e)}>
              <div className="view front-view">
                <i className="fa-solid fa-question"></i>
              </div>
              <div className="view back-view" data-id={item.id}>
                {item.txt}
              </div>
            </div>
          ))}
        </div>
        {modalOpen && modalType === 1 && (
          <Modal modalOpen={modalOpen}>
            <ModalTitle>
              <h4>lỗi khởi tạo</h4>
            </ModalTitle>
            <ModalBody>
              {data?.total > 1 ? (
                <p>Phải có ít nhất 8 thuật ngữ để bắt đầu học tập</p>
              ) : (
                <p>Số card còn lại phải nhiều hơn 8 để bắt đầu học tập</p>
              )}
            </ModalBody>
            <ModalFooter>
              <button
                className="cancel-btn"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Quay lại
              </button>
              <button
                className="ok-btn"
                onClick={() => {
                  navigate(`/card/edit/${slug}`);
                }}
              >
                Thêm thuật ngữ
              </button>
            </ModalFooter>
          </Modal>
        )}
        {modalOpen && modalType === 2 && (
          <Modal modalOpen={modalOpen}>
            <ModalTitle>
              <h4>Xuất sắc</h4>
            </ModalTitle>
            <ModalBody>{<p>Tốt lắm</p>}</ModalBody>
            <ModalFooter>
              <button
                className="cancel-btn"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Quay lại
              </button>
              <button
                className="ok-btn"
                onClick={() => {
                  setRound((round) => round + 1);
                  handleUpdateAndGet();
                  setModalOpen(false);
                }}
              >
                Tiếp tục
              </button>
            </ModalFooter>
          </Modal>
        )}
        {loading && <Skeleton />}
      </div>
    </Helmet>
  );
};

export default MatchCard;
