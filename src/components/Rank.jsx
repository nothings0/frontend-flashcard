import React, { useState } from "react";
import { useQuery } from "react-query";
import { GetRank } from "../redux/apiRequest";
import { Link } from "react-router-dom";
import Skeleton from "./Skeleton";

const Rank = () => {
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("achieve");
  const { data, isLoading } = useQuery({
    queryKey: query,
    queryFn: () => GetRank(query),
    staleTime: 60 * 60 * 1000,
  });

  const handleTap = (tab, query) => {
    setTab(tab);
    setQuery(query);
  };

  return (
    <div className="rank">
      <h3>Bảng xếp hạng</h3>
      <div className="rank__header">
        <div
          className={`rank__header__item ${tab === 0 ? "active" : ""} `}
          onClick={() => handleTap(0, "achieve")}
        >
          Đóng góp
        </div>
        <div
          className={`rank__header__item ${tab === 1 ? "active" : ""} `}
          onClick={() => handleTap(1, "rank")}
        >
          Học tập
        </div>
      </div>
      <div className="rank__body">
        {isLoading ? (
          <Skeleton type="rank" />
        ) : (
          <>
            {data.map((item, index) => (
              <Link
                className="rank__item"
                key={item._id}
                to={`/user/${item.username}`}
              >
                <div className="rank__item__num">0{index + 1}</div>
                <div className="rank__item__user">
                  <span>{item.username}</span>
                  {query === "achieve" && <span>{item.termCount} thẻ</span>}
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Rank;
