import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { savedCard } from "../redux/apiRequest";

const DetailIcon = ({ setModalOpen, iUsername }) => {
  const { slug } = useParams();
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  const username = useSelector(
    (state) => state.user.currentUser?.user.username
  );

  const [isMenuActive, setMenuActive] = useState(false);
  const [isShareActive, setShareActive] = useState(false);

  const menuRef = useRef();
  const shareRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuActive(false);
      }
    }
    if (isMenuActive) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isMenuActive]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setShareActive(false);
      }
    }
    if (isShareActive) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isShareActive]);

  const handleMenu = () => {
    setMenuActive(!isMenuActive);
  };
  const handleShare = () => {
    setShareActive(!isShareActive);
  };
  const handleSavedCard = () => {
    savedCard(dispatch, slug, accessToken);
  };

  return (
    <>
      <div
        className="card-detail__info__icon__wrap"
        tooltip-position="bottom"
        data-c-tooltip="Lưu học phần"
      >
        <i
          className={`${!accessToken && "disable"} fa-solid fa-plus`}
          onClick={handleSavedCard}
        ></i>
      </div>
      <div
        className="card-detail__info__icon__wrap"
        tooltip-position="bottom"
        data-c-tooltip="Chỉnh sửa"
      >
        <Link
          to={`/card/edit/${slug}`}
          className={`${username !== iUsername && "disable"}`}
        >
          <i className="fa-solid fa-pencil"></i>
        </Link>
      </div>
      <div
        className="card-detail__info__menu"
        ref={shareRef}
        tooltip-position="bottom"
        data-c-tooltip="Chia sẻ"
      >
        <i className="fa-solid fa-share-from-square" onClick={handleShare}></i>
        <div
          className={`${isShareActive
              ? "card-detail__info__menu__list active"
              : "card-detail__info__menu__list"
            }`}
          ref={shareRef}
        >
          <a
            href={`https://www.facebook.com/sharer.php?u=https://fluxquiz.vercel.app/card/${slug}`}
            target="_blank"
          >
            <i className="fa-brands fa-facebook" rel="noopener noreferrer"></i>{" "}
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?refer_source=https://fluxquiz.vercel.app/card/${slug}`}
            target="_blank"
          >
            <i className="fa-brands fa-twitter" rel="noopener noreferrer"></i>{" "}
            Twitter
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(`https://fluxquiz.vercel.app/card/${slug}`);
              setShareActive(!isShareActive);
            }}
            rel="noopener noreferrer"
          >
            <i className="fas fa-link"></i> Sao chép liên kết
          </a>

        </div>
      </div>
      <div
        className={`${!accessToken && "disable"} card-detail__info__menu`}
        ref={menuRef}
      >
        <i className="fa-solid fa-ellipsis" onClick={handleMenu}></i>
        <div
          className={`${isMenuActive
              ? "card-detail__info__menu__list active"
              : "card-detail__info__menu__list"
            }`}
          ref={menuRef}
        >
          <span
            className={`${username !== iUsername && "disable"}`}
            onClick={() => setModalOpen(true)}
          >
            <i className="fa-solid fa-trash-can"></i> xóa
          </span>
        </div>
      </div>
    </>
  );
};

export default DetailIcon;
