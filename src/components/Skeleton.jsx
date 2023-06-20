import React from "react";

const Skeleton = ({ type = "loading" }) => {
  // const COUNTER = 4

  const Loading = () => (
    <div className="loadSk">
      <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66">
        <circle
          className="path"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          cx="33"
          cy="33"
          r="30"
        ></circle>
      </svg>
    </div>
  );

  const FeedSkeleton = () => (
    <div className="post">
      <div className="postSk__heading">
        <div className="postSk__heading__left"></div>
        <div className="postSk__heading__right"></div>
      </div>
      <div className="postSk">
        <div className="postWrap">
          <div className="postSkImg"></div>
          <div className="postSkInfo">
            <div className="postSkDetail">
              <div className="postSkText"></div>
              <div className="postSkText sm"></div>
            </div>
          </div>
        </div>
        <div className="postWrap">
          <div className="postSkImg"></div>
          <div className="postSkInfo">
            <div className="postSkDetail">
              <div className="postSkText"></div>
              <div className="postSkText sm"></div>
            </div>
          </div>
        </div>
        <div className="postWrap">
          <div className="postSkImg"></div>
          <div className="postSkInfo">
            <div className="postSkDetail">
              <div className="postSkText"></div>
              <div className="postSkText sm"></div>
            </div>
          </div>
        </div>
        <div className="postWrap">
          <div className="postSkImg"></div>
          <div className="postSkInfo">
            <div className="postSkDetail">
              <div className="postSkText"></div>
              <div className="postSkText sm"></div>
            </div>
          </div>
        </div>
        <div className="postWrap">
          <div className="postSkImg"></div>
          <div className="postSkInfo">
            <div className="postSkDetail">
              <div className="postSkText"></div>
              <div className="postSkText sm"></div>
            </div>
          </div>
        </div>
        <div className="postWrap">
          <div className="postSkImg"></div>
          <div className="postSkInfo">
            <div className="postSkDetail">
              <div className="postSkText"></div>
              <div className="postSkText sm"></div>
            </div>
          </div>
        </div>
        <div className="postWrap">
          <div className="postSkImg"></div>
          <div className="postSkInfo">
            <div className="postSkDetail">
              <div className="postSkText"></div>
              <div className="postSkText sm"></div>
            </div>
          </div>
        </div>
        <div className="postWrap">
          <div className="postSkImg"></div>
          <div className="postSkInfo">
            <div className="postSkDetail">
              <div className="postSkText"></div>
              <div className="postSkText sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Calendar = () => (
    <div className="calendar-ske">
      <div className="calendar-ske__item">
        <div className="calendar-ske__item__heading"></div>
        <div className="calendar-ske__item__add"></div>
        <div className="calendar-ske__item__task sm"></div>
        <div className="calendar-ske__item__task lg"></div>
        <div className="calendar-ske__item__task sm"></div>
      </div>
      <div className="calendar-ske__item">
        <div className="calendar-ske__item__heading"></div>
        <div className="calendar-ske__item__add"></div>
        <div className="calendar-ske__item__task lg"></div>
        <div className="calendar-ske__item__task sm"></div>
      </div>
      <div className="calendar-ske__item">
        <div className="calendar-ske__item__heading"></div>
        <div className="calendar-ske__item__add"></div>
        <div className="calendar-ske__item__task lg"></div>
        <div className="calendar-ske__item__task lg"></div>
        <div className="calendar-ske__item__task sm"></div>
      </div>
    </div>
  );

  const Detail = () => (
    <div className="detail-ske">
      <div className="detail-ske__heading"></div>
      <div className="detail-ske__container">
        <div className="detail-ske__menu">
          <div className="detail-ske__menu__item"></div>
          <div className="detail-ske__menu__item"></div>
          <div className="detail-ske__menu__item"></div>
          <div className="detail-ske__menu__item"></div>
          <div className="detail-ske__menu__item"></div>
        </div>
        <div className="detail-ske__table"></div>
      </div>
      <div className="detail-ske__bottom">
        <div className="detail-ske__bottom__left"></div>
        <div className="detail-ske__bottom__right">
          <div className="detail-ske__bottom__right__item"></div>
          <div className="detail-ske__bottom__right__item"></div>
          <div className="detail-ske__bottom__right__item"></div>
          <div className="detail-ske__bottom__right__item"></div>
          <div className="detail-ske__bottom__right__item"></div>
        </div>
      </div>
    </div>
  );
  const Rank = () => (
    <div className="rank-ske">
      <div className="rank-ske__item">
        <div className="rank-ske__item__num"></div>
        <div className="rank-ske__item__text"></div>
      </div>
      <div className="rank-ske__item">
        <div className="rank-ske__item__num"></div>
        <div className="rank-ske__item__text"></div>
      </div>
      <div className="rank-ske__item">
        <div className="rank-ske__item__num"></div>
        <div className="rank-ske__item__text"></div>
      </div>
      <div className="rank-ske__item">
        <div className="rank-ske__item__num"></div>
        <div className="rank-ske__item__text"></div>
      </div>
      <div className="rank-ske__item">
        <div className="rank-ske__item__num"></div>
        <div className="rank-ske__item__text"></div>
      </div>
    </div>
  );
  const Chart = () => (
    <div className="chart-ske">
      <div className="chart-ske__item">
        <div className="chart-ske__item__column"></div>
        <div className="chart-ske__item__text"></div>
      </div>
      <div className="chart-ske__item">
        <div className="chart-ske__item__column"></div>
        <div className="chart-ske__item__text"></div>
      </div>
      <div className="chart-ske__item">
        <div className="chart-ske__item__column"></div>
        <div className="chart-ske__item__text"></div>
      </div>
    </div>
  );

  if (type === "feed") return <FeedSkeleton />;
  if (type === "loading") return <Loading />;
  if (type === "calendar") return <Calendar />;
  if (type === "detail") return <Detail />;
  if (type === "rank") return <Rank />;
  if (type === "chart") return <Chart />;
};

export default Skeleton;
