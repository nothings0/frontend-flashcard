import React, { useRef, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { GetNotifi, ReadNotifi } from "../redux/apiRequest";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import Skeleton from "./Skeleton";
const logo = require("../assets/Logo.png");

const Notifi = () => {
  const queryClient = useQueryClient();
  const [isNotifiActive, setIsNotifiActive] = useState(false);
  const notifiRef = useRef();
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  const { data: notifis, isLoading } = useQuery({
    queryFn: () => GetNotifi(accessToken),
    queryKey: "notification",
    staleTime: 3 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
  });

  const { mutate } = useMutation({
    mutationFn: (notifiId) => ReadNotifi(notifiId, accessToken),
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifiRef.current && !notifiRef.current.contains(event.target)) {
        setIsNotifiActive(false);
      }
    }
    if (isNotifiActive) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isNotifiActive]);

  const ReadedNotifi = async (notifiId, isRead) => {
    if (!isRead) {
      mutate(notifiId, {
        onSuccess: () => {
          queryClient.invalidateQueries(["notification"]);
        },
      });
    }
  };
  const handleNotifiActive = () => {
    setIsNotifiActive(!isNotifiActive);
  };

  return (
    <div
      className="searching__ava__notifi"
      ref={notifiRef}
      onClick={handleNotifiActive}
    >
      <i className="fa-solid fa-bell"></i>
      <div
        className={`searching__ava__list lg ${isNotifiActive ? "active" : ""}`}
        ref={notifiRef}
      >
        <div className="searching__ava__list__heading">Thông báo</div>
        {!isLoading ? (
          <>
            {notifis?.map((item) => (
              <div
                className={`searching__ava__notifi__wrap ${
                  item?.isRead ? "read" : ""
                }`}
                onClick={() => ReadedNotifi(item._id, item.isRead)}
                key={item?._id}
              >
                <div className="searching__ava__notifi__img">
                  <img src={logo} alt="Logo FLuxquiz" />
                </div>
                <div className="searching__ava__notifi__content">
                  <p>{item.content}</p>
                  <span>{moment(item.createdAt).fromNow()}</span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <Skeleton type="loading" />
        )}
      </div>
    </div>
  );
};

export default Notifi;
