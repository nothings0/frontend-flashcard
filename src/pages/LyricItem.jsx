import { Link } from "react-router-dom";

const LyricItem = ({ item }) => {
  return (
    <Link to={`${item.slug}`} className="lyric-training__item">
      <div className="lyric-training__item__img">
        <img src={item.thumbnail} alt="ted-video" />
      </div>
      <div className="lyric-training__item__txt">
        <div className="lyric-training__item__title">{item.title}</div>
      </div>
      <span className={`level level__${item.level}`}>{item.level}</span>
    </Link>
  );
};

export default LyricItem;
