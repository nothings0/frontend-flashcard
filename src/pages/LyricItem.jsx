import React from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";

const LyricItem = ({ item }) => {
  return (
    <Link to={`${item.slug}`} className="lyric-training__item">
      <div className="lyric-training__item__img">
        <img src={item.thumbnail} alt="ted-video" />
      </div>
      <div className="lyric-training__item__txt">
        <div className="lyric-training__item__title">{item.title}</div>
        <div className="lyric-training__item__time">
          Posted {moment(item?.createdAt).format("MMM YYYY")}
        </div>
      </div>
    </Link>
  );
};

export default LyricItem;
