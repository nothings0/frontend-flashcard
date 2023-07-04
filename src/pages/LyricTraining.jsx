import React from "react";
import Search from "../components/Search";
import { GetListTed } from "../redux/lyricApi";
import Skeleton from "../components/Skeleton";
import { useQuery } from "react-query";
const LyricItem = React.lazy(() => import("./LyricItem"));

const LyricTraining = () => {
  const { data: listData, isLoading } = useQuery({
    queryFn: () => GetListTed(),
    queryKey: "list-training",
    staleTime: 24 * 60 * 60 * 1000,
  });

  return (
    <div className="lyric-training">
      <Search />
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="lyric-training__container">
          {listData?.topic.videos.nodes.map((item, index) => (
            <LyricItem item={item} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LyricTraining;
