import {useRef, useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom"

const HeaderChild = () => {
  const [topActive, setTopActive] = useState(false)
  const menuRef = useRef()
  const { cardId } = useParams()

  const handleTopRef = () => {
    setTopActive(!topActive)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setTopActive(false)
      }
    }
    if (topActive) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [topActive])

  return (
    
    <div className="card-detail__header__title__btn" ref={menuRef}>
    <div
      className="card-detail__header__title__btn__in"
      onClick={handleTopRef}
    >
      Học <i className="fa-solid fa-angle-down"></i>
    </div>
      <div className={`card-detail__header__title__btn__menu left ${topActive ? 'active' : ''}`} ref={menuRef}>
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
  );
};

export default HeaderChild;
