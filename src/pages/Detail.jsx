import React, { useState, useEffect, useRef, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../components/Modal";
import {
  approvalCard,
  DeleteCard,
  getCardById,
  GetListCard,
  RateCard,
} from "../redux/apiRequest";
import FlipCard from "../components/FlipCard";
import Search from "../components/Search";
import Helmet from "../components/Helmet";
import DetailIcon from "../components/DetailIcon";
import Skeleton from "../components/Skeleton";
import TermWrap from "../components/TermWrap";
import List from "../components/List";
import { add } from "../redux/cardSlice";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";

// Separate ProMaxPopup component
const ProMaxPopup = ({ isOpen, onClose, onUpgrade }) => {
  const popupRef = useRef();

  useEffect(() => {
    if (isOpen) {
      popupRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <Skeleton type="detail" />
      <div className="popup" tabIndex={0} ref={popupRef}>
        <div className="popup__content">
          <h2>Đây là thẻ học ProMax</h2>
          <p>
            Thẻ học này yêu cầu bạn phải nâng cấp tài khoản lên FluxQuiz Plus để có thể
            học.
          </p>
          <div className="popup__buttons">
            <button onClick={onUpgrade}>Nâng cấp</button>
          </div>
        </div>
      </div>
      <div className="popup__overlay" onClick={onClose}></div>
    </>
  );
};

const Detail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();

  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  const userId = useSelector(
    (state) => state.user.currentUser?.user._id
  );
  const plan = useSelector(
    (state) => state.user.currentUser?.user.plan
  );
  const { loading } = useSelector((state) => state.middle);

  const [data, setData] = useState(null);
  const [listSuggest, setListSuggest] = useState([]);
  const [page, setPage] = useState(1);
  const [topActive, setTopActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(1);
  const [rateNum, setRateNum] = useState(1);
  const [terms, setTerms] = useState([]);
  const [run, setRun] = useState({ isRun: true, stepIndex: 1 });
  const [popupOpen, setPopupOpen] = useState(false);

  const topRef = useRef();
  const menuRef = useRef();

  const steps = [
    {
      target: ".item_0",
      content: "This is my awesome feature! 1",
      placement: "right",
    },
    {
      target: ".item_1",
      content: "Xem qua và luyện ghi nhớ từ vựng",
      placement: "right",
    },
    {
      target: ".item_2",
      content: "Phương pháp làm trắc nghiệm giúp ghi nhớ từ vựng",
      placement: "right",
    },
    {
      target: ".item_3",
      content: "Luyện viết từ vựng",
      placement: "right",
    },
    {
      target: ".item_4",
      content: "Luyện nghe từ vựng",
      placement: "right",
    },
    {
      target: ".item_5",
      content: "Kiểm tra ghi nhớ thông qua minigame ghép thẻ",
      placement: "right",
    },
    {
      target: ".item_6",
      content: "Cuối cùng! Kiểm tra lại toàn bộ quá trình ghi nhớ từ vựng của bạn",
      placement: "right",
    },
  ];

  // Fetch suggested cards and additional pages
  useEffect(() => {
    const fetchSuggest = async () => {
      const res = await GetListCard(dispatch, "suggest", 1, 8);
      setListSuggest(res);
    };

    const fetchMoreTerms = async () => {
      const res = await getCardById(dispatch, slug, page, 50);
      setTerms((prev) => [...prev, ...res.terms]);
      dispatch(add(res.terms));
    };

    fetchSuggest();
    if (page > 1) fetchMoreTerms();
  }, [dispatch, slug, page]);

  // Fetch initial card data
  useEffect(() => {
    const fetchCard = async () => {
      setPage(1);
      const res = await getCardById(dispatch, slug, 1, 50);
      if (res?.cards?.type && res.cards.type.toUpperCase() === "PROMAX" && plan?.type !== "PROMAX") {
        setPopupOpen(true);
        return;
      }
      setData(res);
      setTerms(res?.terms || []);
    };
    fetchCard();
  }, [dispatch, slug, plan?.type]);

  // Handle scroll and Joyride initialization
  useEffect(() => {
    let isNew = localStorage.getItem("isNew");
    if (isNew) isNew = JSON.parse(isNew);
    else {
      isNew = { detailPage: false, homePage: false };
      localStorage.setItem("isNew", JSON.stringify(isNew));
    }

    if (isNew.detailPage) {
      setRun((prev) => ({ ...prev, isRun: false }));
    }

    const handleScroll = () => {
      if (document.documentElement.scrollTop >= 300) {
        topRef.current?.classList.add("shrink");
      } else {
        topRef.current?.classList.remove("shrink");
        setTopActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      localStorage.setItem(
        "isNew",
        JSON.stringify({ detailPage: true, homePage: false })
      );
    };
  }, []);

  // Handle click outside for menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setTopActive(false);
      }
    };
    if (topActive) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [topActive]);

  // Handlers
  const handleTopRef = () => setTopActive((prev) => !prev);

  const handleDelete = async () => {
    const res = await DeleteCard(slug, userId, accessToken, dispatch);
    setModalOpen(false);
    if (res.type === "success") navigate(-1);
  };

  const handleRate = (x) => {
    setRateNum(x);
    RateCard(data.cards.slug, x, accessToken, dispatch);
  };

  const handleLoadMore = () => setPage((prev) => prev + 1);

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setRun((prev) => ({
        ...prev,
        stepIndex: index + (action === ACTIONS.PREV ? -1 : 1),
      }));
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun((prev) => ({ ...prev, isRun: false }));
      localStorage.setItem(
        "isNew",
        JSON.stringify({ detailPage: true, homePage: false })
      );
    }
  };

  const handleApproval = async () => {
    const res = await approvalCard(slug, accessToken);
    if (res.code === 200) {
      window.location.reload();
    } else {
      alert(res.msg);
    }
  };

  const isOwner = data?.cards?.user._id === userId;
  const cardType = data?.cards?.type?.toUpperCase();

  return (
    <Helmet title={`${data?.cards?.title || "Loading"} | Flux`}>
      <div className="card-detail">
        <Search />
        <ProMaxPopup
          isOpen={popupOpen}
          onClose={() => setPopupOpen(false)}
          onUpgrade={() => {
            setPopupOpen(false);
            navigate("/pricing");
          }}
        />
        {loading ? (
          <Skeleton type="detail" />
        ) : (
          data && (
            <>
              <div className="card-detail__header">
                <div className="card-detail__header__title" ref={topRef}>
                  <h2 className="card-detail__header__title__txt">
                    {data.cards.title}
                  </h2>
                  <div className="card-detail__header__title__btn" ref={menuRef}>
                    <div
                      className="card-detail__header__title__btn__in"
                      onClick={handleTopRef}
                    >
                      Học <i className="fa-solid fa-angle-down"></i>
                    </div>
                    <div
                      className={`card-detail__header__title__btn__menu ${
                        topActive ? "active" : ""
                      }`}
                    >
                      <Link to={`/learn/${slug}`}>
                        <div className="card-detail__left__item">Học</div>
                      </Link>
                      <Link to={`/write/${slug}`}>
                        <div className="card-detail__left__item">Viết</div>
                      </Link>
                      <Link to={`/listen/${slug}`}>
                        <div className="card-detail__left__item">Nghe</div>
                      </Link>
                      <Link to={`/match/${slug}`}>
                        <div className="card-detail__left__item">Ghép thẻ</div>
                      </Link>
                      <Link to={`/test/${slug}`}>
                        <div className="card-detail__left__item">Kiểm tra</div>
                      </Link>
                      <Link to={`/${slug}/live`}>
                        <div className="card-detail__left__item">Live</div>
                      </Link>
                      {isOwner ? (
                        cardType === "PREMIUM" ? (
                          <Link to={`/card/p/${slug}`}>
                            <div className="card-detail__left__item plus">
                              Fluxquiz Plus
                            </div>
                          </Link>
                        ) : cardType === "PENDING" ? (
                          <div className="card-detail__left__item pending disable">
                            Pending
                          </div>
                        ) : (
                          <div
                            className="card-detail__left__item approval"
                            onClick={handleApproval}
                          >
                            Nâng cấp
                          </div>
                        )
                      ) : userId && plan.type === "PREMIUM" ? (
                        <Link to={`/card/p/${slug}`}>
                          <div className="card-detail__left__item plus">
                            Fluxquiz Plus
                          </div>
                        </Link>
                      ) : (
                        <Link to="/pricing">
                          <div className="card-detail__left__item plus">
                            Fluxquiz Plus
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-detail__header__rate">
                  <i
                    className="fas fa-star"
                    onClick={() => {
                      setModalOpen(true);
                      setModalType(2);
                    }}
                  ></i>
                  {data.rate?.time > 0 ? (
                    <span>
                      {data.rate.total}.0 ({data.rate.time} lượt đánh giá)
                    </span>
                  ) : (
                    <span>Chưa có lượt đánh giá</span>
                  )}
                </div>
              </div>
              <div className="card-detail__top">
                <div className="card-detail__left">
                  <Link to={`/learn/${slug}`}>
                    <div className="card-detail__left__item item_2">Học</div>
                  </Link>
                  <Link to={`/write/${slug}`}>
                    <div className="card-detail__left__item item_3">Viết</div>
                  </Link>
                  <Link to={`/listen/${slug}`}>
                    <div className="card-detail__left__item item_4">Nghe</div>
                  </Link>
                  <Link to={`/match/${slug}`}>
                    <div className="card-detail__left__item item_5">Ghép thẻ</div>
                  </Link>
                  <Link to={`/test/${slug}`}>
                    <div className="card-detail__left__item item_6">Kiểm tra</div>
                  </Link>
                  <Link to={`/${slug}/live`}>
                    <div className="card-detail__left__item item_6">Live</div>
                  </Link>
                  {isOwner ? (
                    cardType === "PREMIUM" ? (
                      <Link to={`/card/p/${slug}`}>
                        <div className="card-detail__left__item plus">
                          Fluxquiz Plus
                        </div>
                      </Link>
                    ) : cardType === "PENDING" ? (
                      <div className="card-detail__left__item pending disable">
                        Pending
                      </div>
                    ) : (
                      <div
                        className="card-detail__left__item approval"
                        onClick={handleApproval}
                      >
                        Nâng cấp
                      </div>
                    )
                  ) : userId && plan.type === "PREMIUM" ? (
                    <Link to={`/card/p/${slug}`}>
                      <div className="card-detail__left__item plus">
                        Fluxquiz Plus
                      </div>
                    </Link>
                  ) : (
                    <Link to="/pricing">
                      <div className="card-detail__left__item plus">
                        Fluxquiz Plus
                      </div>
                    </Link>
                  )}
                  <Joyride
                    run={run.isRun}
                    steps={steps}
                    stepIndex={run.stepIndex}
                    continuous
                    disableOverlayClose
                    disableCloseOnEsc
                    scrollOffset={80}
                    hideBackButton
                    locale={{ last: "Ok" }}
                    beaconComponent={React.forwardRef(() => null)}
                    callback={handleJoyrideCallback}
                  />
                </div>
                <div className="card-detail__right">
                  <FlipCard data={terms} isVolume={false} isOpenAI={false} />
                </div>
              </div>
              <div className="card-detail__info">
                <p className="card-detail__info__user item_0">
                  Tạo bởi
                  <span>
                    <Link to={`/user/${data.cards.user.username}`}>
                      {data.cards.user.username}
                    </Link>
                  </span>
                </p>
                <div className="card-detail__info__icon">
                  <DetailIcon
                    data={data}
                    setModalOpen={setModalOpen}
                    iUsername={data.cards.user.username}
                  />
                </div>
              </div>
              <div className="card-detail__des">
                <div className="card-detail__des__heading">
                  <h3>Thuật ngữ trong học phần này</h3>
                </div>
                <TermWrap
                  terms={terms}
                  setTerms={setTerms}
                  iUsername={data.cards.user.username}
                  type="detail"
                />
                {data.total > page * 50 && (
                  <div className="load-more">
                    <span onClick={handleLoadMore}>Xem thêm</span>
                  </div>
                )}
              </div>
            </>
          )
        )}
        {modalOpen && modalType === 1 && (
          <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <ModalTitle fnClose={() => setModalOpen(false)}>
              <h4>Xóa học phần</h4>
            </ModalTitle>
            <ModalBody>
              <p>Bạn có chắc chắn muốn xóa học phần này ?</p>
            </ModalBody>
            <ModalFooter>
              <button className="cancel-btn" onClick={() => setModalOpen(false)}>
                Hủy
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                Xóa
              </button>
            </ModalFooter>
          </Modal>
        )}
        {modalOpen && modalType === 2 && (
          <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <ModalTitle fnClose={() => setModalOpen(false)}>
              <h4>Đánh giá học phần</h4>
            </ModalTitle>
            <ModalBody>
              <div className="card-detail__header__rating">
                {[5, 4, 3, 2, 1].map((num) => (
                  <React.Fragment key={num}>
                    <input
                      type="radio"
                      name="rate"
                      id={`rate-${num}`}
                      checked={rateNum === num}
                      onChange={() => setRateNum(num)}
                    />
                    <label
                      htmlFor={`rate-${num}`}
                      className="fas fa-star"
                      onClick={() => setRateNum(num)}
                    ></label>
                  </React.Fragment>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <button className="cancel-btn" onClick={() => setModalOpen(false)}>
                Hủy
              </button>
              <button
                className="ok-btn"
                onClick={() => {
                  handleRate(rateNum);
                  setModalOpen(false);
                }}
              >
                Đánh giá
              </button>
            </ModalFooter>
          </Modal>
        )}
        <List title={listSuggest?.title} data={listSuggest?.cards} type="suggest" />
      </div>
    </Helmet>
  );
};

export default memo(Detail);