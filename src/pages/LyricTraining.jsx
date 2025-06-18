import React from "react";
import Search from "../components/Search";
import Skeleton from "../components/Skeleton";
import { useQuery } from "react-query";
import { getExercises } from "../redux/apiRequest";
const LyricItem = React.lazy(() => import("./LyricItem"));

const LyricTraining = () => {
  const { data: listData, isLoading } = useQuery({
    queryFn: () => getExercises(),
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
          {listData?.map((item, index) => (
            <LyricItem item={item} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LyricTraining;
