import React, { useState, useEffect } from "react";
import Search from "../components/Search";
import { GetListTed } from "../redux/lyricApi";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "../components/Skeleton";
const LyricItem = React.lazy(() => import("./LyricItem"));

const LyricTraining = () => {
  const { loading } = useSelector((state) => state.middle);
  const [listData, setListData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const listTraining = localStorage.getItem("listTraining");
    if (listTraining) {
      setListData(JSON.parse(listTraining));
      return;
    }
    const getData = async () => {
      const res = await GetListTed(dispatch);
      setListData(res.topic.videos.nodes);
      localStorage.setItem(
        "listTraining",
        JSON.stringify(res.topic.videos.nodes)
      );
    };
    getData();
  }, []);

  return (
    <div className="lyric-training">
      <Search />
      {loading ? (
        <Skeleton />
      ) : (
        <div className="lyric-training__container">
          {listData?.map((item, index) => (
            <LyricItem item={item} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LyricTraining;
