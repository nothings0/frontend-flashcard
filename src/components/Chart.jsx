import React from "react";
import { useQuery } from "react-query";
import { GetActive } from "../redux/apiRequest";
import { Link } from "react-router-dom";
import Skeleton from "./Skeleton";

const Chart = ({ accessToken }) => {
  const { data, isLoading } = useQuery({
    queryKey: "active",
    queryFn: () => GetActive(accessToken),
  });

  return (
    <div className="chart">
      {isLoading ? (
        <Skeleton type="chart" />
      ) : (
        <div className="chart__container">
          {data?.data.map((item, index) => {
            const percent = (item.data / data.max) * 100;
            const height =
              percent === 0 || isNaN(percent) ? "20px" : `${percent}%`;
            return (
              <div className="chart__wrap" key={index}>
                <div className="chart__column__wrap">
                  <div
                    className="chart__column"
                    style={{ "--height": `${height}` }}
                  >
                    <div className="chart__number">{item.data}</div>
                  </div>
                </div>
                <div className="chart__text">{item.text}</div>
              </div>
            );
          })}
        </div>
      )}
      <div className="chart__bottom">
        <Link to="/test/space-repetition" className="chart__btn">
          Ôn tập ngay
        </Link>
      </div>
    </div>
  );
};

export default Chart;
