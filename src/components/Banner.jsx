import React, { useEffect, useState } from "react";
import banner_1 from "../assets/1.png";
import banner_2 from "../assets/2.jpg";

const banners = [
  {
    img: banner_1,
  },
  {
    img: banner_2,
  },
];

const Banner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newIndex = index + 1 === banners.length ? 0 : index + 1;
      setIndex(newIndex);
      handleIndex(newIndex);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [index]);

  const handleIndex = (indexSlide) => {
    const newIndex =
      indexSlide >= banners.length
        ? 0
        : indexSlide < 0
        ? banners.length - 1
        : indexSlide;
    setIndex(newIndex);
  };

  return (
    <div className="banner">
      <div className="banner__img">
        {banners.map((item, idx) => (
          <div
            className={`banner__item ${
              index === idx ? "active" : index < idx ? "prev" : "next"
            }`}
            key={idx}
          >
            <img src={item.img} alt="banner" />
          </div>
        ))}
      </div>
      <div className="banner__btn next" onClick={() => handleIndex(index + 1)}>
        <i className="fa-solid fa-chevron-right"></i>
      </div>
      <div className="banner__btn prev" onClick={() => handleIndex(index - 1)}>
        <i className="fa-solid fa-chevron-left"></i>
      </div>
    </div>
  );
};

export default Banner;
