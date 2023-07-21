import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../components/Modal";
import { getCardById, UpdateCard } from "../redux/apiRequest";
import Helmet from "../components/Helmet";
import Search from "../components/Search";
import Skeleton from "../components/Skeleton";
import TermWrap from "../components/TermWrap";

const colors = [
  {
    hex: "flux1",
    css: "linear-gradient(45deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
  },
  {
    hex: "flux2",
    css: "linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)",
  },
  {
    hex: "flux3",
    css: "linear-gradient(45deg, rgba(253,227,26,1) 0%, rgba(254,139,37,1) 100%)",
  },
  {
    hex: "flux4",
    css: "linear-gradient(135deg, rgba(154,4,129,1) 0%, rgba(220,61,99,1) 50%, rgba(254,115,23,1) 100%)",
  },
  {
    hex: "flux5",
    css: "linear-gradient(45deg, rgba(100,38,151,0.9) 0%, rgba(152,45,151,1) 50%, rgba(190,52,117,0.9) 100%)",
  },
  {
    hex: "flux6",
    css: "linear-gradient(45deg, rgba(38,49,151,1) 0%, rgba(39,22,96,1) 50%, rgba(147,52,190,1) 100%)",
  },
];

const Edit = () => {
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  const userId = useSelector((state) => state.user.currentUser?.user._id);
  const { loading } = useSelector((state) => state.middle);
  const { slug } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const [data, setData] = useState([])
  const [total, setTotal] = useState(1);
  const [terms, setTerms] = useState([]);
  const [title, setTitle] = useState("");
  const [user, setUser] = useState("");
  const [description, setDescription] = useState("");
  const [background, setBackground] = useState([colors[0].css]);
  const [share, setShare] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const topRef = useRef(null);

  useEffect(() => {
    if (!userId || !accessToken) {
      navigate("/login");
      return;
    } else {
      const getData = async () => {
        const res = await getCardById(dispatch, slug, page, 50);
        if (res.cards.user._id !== userId) {
          navigate("/");
        }
        if (page === 1) {
          setTotal(res.total);
          setUser(res.cards.user.username);
          setTitle(res.cards.title);
          setDescription(res.cards.description);
          setShare(res.cards.share);
          setBackground(res.cards.background);
        }
        setTerms((terms) => [...terms, ...res.terms]);
      };
      getData();
    }
  }, [slug, page]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop >= 60 ||
        document.documentElement.scrollTop >= 60
      ) {
        topRef?.current?.classList.add("shrink");
      } else {
        topRef?.current?.classList.remove("shrink");
      }
    });
    return () => {
      window.removeEventListener("scroll", null);
    };
  }, []);

  const handleView = () => {
    const newTerm = {
      prompt: "",
      answer: "",
    };
    let termArr = [...terms, newTerm];
    setTerms(termArr);
  };

  const handleUpdate = async () => {
    const newCard = {
      title,
      description,
      background,
      share,
      term: terms,
    };

    if (newCard.term.length < 2) {
      setModalOpen(true);
    } else {
      const res = await UpdateCard(
        newCard,
        slug,
        accessToken,
        userId,
        dispatch
      );
      if (res.type === "failure") return;
      navigate(`/card/${slug}`);
    }
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <Helmet title={`${title} | Flux` || `Loading`}>
      <div className="edit">
        <Search />
        <div className="edit__top" ref={topRef}>
          <div className="edit__top__left">Chỉnh sửa học phần</div>
          <div className="edit__top__right" onClick={handleUpdate}>
            Hoàn tất
          </div>
        </div>
        <div className="edit__header">
          <div className="edit__header__left">
            <div className="edit__header__input">
              <div className="edit__header__input__wrap">
                <textarea
                  maxLength="30"
                  placeholder="Nhập tiêu đề..."
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                ></textarea>
                <small>{title.length}/30</small>
              </div>
              <p>tiêu đề</p>
            </div>
            <div className="edit__header__input">
              <div className="edit__header__input__wrap">
                <textarea
                  className="edit__header__input__wrap__des"
                  maxLength="200"
                  placeholder="Thêm mô tả"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  rows={4}
                ></textarea>
                <small>{description.length}/200</small>
              </div>
              <p>mô tả</p>
            </div>
          </div>
          <div className="edit__header__right">
            <div className="edit__header__right__item">
              <div className="edit__header__right__item__txt">Ảnh nền</div>
              <div className="edit__header__right__item__color">
                {colors.map((item, index) => {
                  const style = {
                    background: `${item.css}`,
                  };
                  return (
                    <div
                      className={`edit__header__right__item__color__item ${
                        item.css === background ? "active" : ""
                      }`}
                      key={index}
                      style={style}
                      onClick={() => setBackground(item.css)}
                    ></div>
                  );
                })}
              </div>
            </div>
            <div className="edit__header__right__item">
              <div className="checkbox__private">
                <div className="checkbox__private__txt">
                  <span>Share</span>{" "}
                  <input
                    type="checkbox"
                    onClick={(e) => setShare(e.target.checked)}
                    value={share}
                    checked={share}
                  ></input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="edit__term">
          <TermWrap terms={terms} setTerms={setTerms} iUsername={user} />
          {total > page && (
            <div className="load-more">
              <span onClick={handleLoadMore}>Xem thêm</span>
            </div>
          )}
        </div>
        <div className="edit__btn" onClick={handleView}>
          <div className="edit__btn__wrap">
            <i className="fa-solid fa-plus"></i> thêm thẻ
          </div>
        </div>
        {modalOpen && (
          <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <ModalTitle fnClose={() => setModalOpen(false)}>
              <h4>Lỗi tạo học phần</h4>
            </ModalTitle>
            <ModalBody>
              <p>Bạn phải có ít nhất 2 thuật ngữ để bắt đầu học tập</p>
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
                  setModalOpen(false);
                }}
              >
                Ok
              </button>
            </ModalFooter>
          </Modal>
        )}
        {loading && <Skeleton />}
      </div>
    </Helmet>
  );
};

export default Edit;
