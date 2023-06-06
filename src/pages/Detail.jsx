import React, { useState, useEffect, useRef, memo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../components/Modal"
import {
  DeleteCard,
  getCardById,
  GetListCard,
  RateCard
} from "../redux/apiRequest"
import FlipCard from "../components/FlipCard"
import Search from "../components/Search"
import Helmet from "../components/Helmet"
import DetailIcon from "../components/DetailIcon"
import Skeleton from "../components/Skeleton"
import TermWrap from "../components/TermWrap"
import List from '../components/List'
// import { handleLoading, handleRemove } from "../redux/middleSlice"
import { add } from "../redux/cardSlice"
// import GoogleAds from "../components/GoogleAds"

const Detail = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [data, setData] = useState([])
  const [listSuggest, setListSuggest] = useState([])
  const [page, setPage] = useState(1)
  const [topActive, setTopActive] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState(1)
  const [rateNum, setRateNum] = useState(1)
  const [terms, setTerms] = useState([])

  const { cardId } = useParams()
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  )
  const userId = useSelector((state) => state.user.currentUser?.user._id)
  const { loading } = useSelector((state) => state.middle)
  const topRef = useRef()
  const menuRef = useRef()

  useEffect(() => {
    const getData = async() => {
      try {
        const res = await GetListCard(dispatch, 'suggest', 1, 8)
        setListSuggest(res)
      } catch (err) {
      }
    }
    getData()
  }, [page])

  useEffect(() => {
    const getData = async () => {
      const res = await getCardById(dispatch, cardId, page, 50)
      setTerms(terms => [...terms, ...res.terms])
      dispatch(add(res.terms))
    }
    page > 1 && getData()
  }, [page])
  useEffect(() => {
    const getData = async () => {
      setPage(1)
      const res = await getCardById(dispatch, cardId, 1, 50)
      setData(res)
      setTerms(res.terms)
    }
    getData()
  }, [cardId])

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop >= 60 ||
        document.documentElement.scrollTop >= 60
      ) {
        topRef?.current?.classList.add("shrink")
      } else {
        topRef?.current?.classList.remove("shrink")
        setTopActive(false)
      }
    })
    return () => {
      window.removeEventListener("scroll", null)
    }
  }, [])

  const handleTopRef = () => {
    setTopActive(!topActive)
  }

  useEffect(() => {
    function handleClickOutside(event) {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setTopActive(false)
    }
    }
    if(topActive){
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }
  }, [topActive])

  const handleDelete = async () => {
    const res = await DeleteCard(cardId, userId, accessToken, dispatch)
    setModalOpen(false)
    if (res.type === "success") {
      navigate(-1)
    }
  }

  const handleRate = (x) => {
    setRateNum(x)
    RateCard(data.cards._id, x, accessToken, dispatch)
  }

  const handleLoadMore = () => {
    setPage(page + 1)
  }

  return (
    <Helmet title={`${data?.cards?.title || "Loading"} | Flux`}>
      <div className="card-detail">
        <Search />
        {
          loading ? <Skeleton type='detail'/> : <>
            {data && (
              <>
                <div className="card-detail__header">
                  <div className="card-detail__header__title" ref={topRef}>
                    <h2 className="card-detail__header__title__txt">
                      {data?.cards?.title}
                    </h2>
                    <div className="card-detail__header__title__btn" ref={menuRef}>
                      <div className="card-detail__header__title__btn__in" onClick={handleTopRef}>
                        Học <i className="fa-solid fa-angle-down"></i>
                      </div>
                        <div className={`card-detail__header__title__btn__menu ${topActive ? 'active' : ''}`} ref={menuRef}>
                          <Link to={`/flashcard/${cardId}`}>
                            <div className="card-detail__left__item">
                              Thẻ ghi nhớ
                            </div>
                          </Link>
                          <Link to={`/learn/${cardId}`}>
                            <div className="card-detail__left__item">Học</div>
                          </Link>
                          <Link to={`/write/${cardId}`}>
                            <div className="card-detail__left__item">Viết</div>
                          </Link>
                          <Link to={`/listen/${cardId}`}>
                            <div className="card-detail__left__item">Nghe</div>
                          </Link>
                          <Link to={`/match/${cardId}`}>
                            <div className="card-detail__left__item">Ghép thẻ</div>
                          </Link>
                          <Link to={`/test/${cardId}`}>
                            <div className="card-detail__left__item">Kiểm tra</div>
                          </Link>
                        </div>
                    </div>
                  </div>
                  <div className="card-detail__header__rate">
                    <i
                      className="fas fa-star"
                      onClick={() => {
                        setModalOpen(true)
                        setModalType(2)
                      }}
                    ></i>
                    {data?.rate?.time > 0 ? (
                      <span>
                        {data?.rate.total}.0 ({data?.rate.time} luợt đánh giá)
                      </span>
                    ) : (
                      <span>Chưa có lượt đánh giá</span>
                    )}
                  </div>
                </div>
                <div className="card-detail__top">
                  <div className="card-detail__left">
                    <Link to={`/flashcard/${cardId}`}>
                      <div className="card-detail__left__item">Thẻ ghi nhớ</div>
                    </Link>
                    <Link to={`/learn/${cardId}`}>
                      <div className="card-detail__left__item">Học</div>
                    </Link>
                    <Link to={`/write/${cardId}`}>
                      <div className="card-detail__left__item">Viết</div>
                    </Link>
                    <Link to={`/listen/${cardId}`}>
                      <div className="card-detail__left__item">Nghe</div>
                    </Link>
                    <Link to={`/match/${cardId}`}>
                      <div className="card-detail__left__item">Ghép thẻ</div>
                    </Link>
                    <Link to={`/test/${cardId}`}>
                      <div className="card-detail__left__item">Kiểm tra</div>
                    </Link>
                  </div>
                  <div className="card-detail__right">
                    <FlipCard data={terms} isVolume={false} />
                  </div>
                </div>
                <div className="card-detail__info">
                  <p className="card-detail__info__user">
                    Tạo bởi   
                    <span>
                      <Link to={`/user/${data?.cards?.user.username}`}>
                        {data?.cards?.user.username}
                      </Link>
                    </span>
                  </p>
                  <div className="card-detail__info__icon">
                    <DetailIcon data={data} setModalOpen={setModalOpen} iUsername={data?.cards?.user.username}/>
                  </div>
                </div>
                {/* <GoogleAds type="ngang"/> */}
                <div className="card-detail__des">
                  <div className="card-detail__des__heading">
                    <h3>Thuật ngữ trong học phần này</h3>
                  </div>
                  <TermWrap terms={terms} setTerms={setTerms} iUsername={data?.cards?.user.username} type='detail'/>
                  {
                    data?.total > page && <div className="load-more">
                    <span onClick={handleLoadMore}>Xem thêm</span>
                  </div>
                  }
                </div>
              </>
            )}
          </>
        }
        {modalOpen && modalType === 1 && (
          <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <ModalTitle fnClose={() => setModalOpen(false)}>
              <h4>Xóa học phần</h4>
            </ModalTitle>
            <ModalBody>
              <p>Bạn có chắc chắn muốn xóa học phần này ?</p>
            </ModalBody>
            <ModalFooter>
              <button
                className="cancel-btn"
                onClick={() => {
                  setModalOpen(false)
                }}
              >
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
                <input
                  type="radio"
                  name="rate"
                  id="rate-5"
                  checked={rateNum === 5 ? true : false}
                />
                <label
                  for="rate-5"
                  className="fas fa-star"
                  onClick={() => setRateNum(5)}
                ></label>
                <input
                  type="radio"
                  name="rate"
                  id="rate-4"
                  checked={rateNum === 4 ? true : false}
                />
                <label
                  for="rate-4"
                  className="fas fa-star"
                  onClick={() => setRateNum(4)}
                ></label>
                <input
                  type="radio"
                  name="rate"
                  id="rate-3"
                  checked={rateNum === 3 ? true : false}
                />
                <label
                  for="rate-3"
                  className="fas fa-star"
                  onClick={() => setRateNum(3)}
                ></label>
                <input
                  type="radio"
                  name="rate"
                  id="rate-2"
                  checked={rateNum === 2 ? true : false}
                />
                <label
                  for="rate-2"
                  className="fas fa-star"
                  onClick={() => setRateNum(2)}
                ></label>
                <input
                  type="radio"
                  name="rate"
                  id="rate-1"
                  checked={rateNum === 1 ? true : false}
                />
                <label
                  for="rate-1"
                  className="fas fa-star"
                  onClick={() => setRateNum(1)}
                ></label>
                <div className="form">
                  <header></header>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <button
                className="cancel-btn"
                onClick={() => {
                  setModalOpen(false)
                }}
              >
                Hủy
              </button>
              <button
                className="ok-btn"
                onClick={() => {
                  handleRate(rateNum)
                  setModalOpen(false)
                }}
              >
                Đánh giá
              </button>
            </ModalFooter>
          </Modal>
        )}
        {/* <GoogleAds type="ngang" /> */}
        <List title={listSuggest?.title} data={listSuggest?.cards} type="suggest"/>
      </div>
    </Helmet>
  )
}

export default memo(Detail)
