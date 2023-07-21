import React, { useRef, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { GetNotifi, ReadNotifi } from "../redux/apiRequest";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
const logo = require("../assets/Logo.png");

const Notifi = () => {
  const queryClient = useQueryClient();
  const [isNotifiActive, setIsNotifiActive] = useState(false);
  const notifiRef = useRef();
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  const {
    data: notifis,
    isLoading,
    isFetching,
  } = useQuery({
    queryFn: () => GetNotifi(accessToken),
    queryKey: "notification",
    staleTime: 3 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
  });

  const { mutate } = useMutation({
    mutationFn: (notifiId) => ReadNotifi(notifiId, accessToken),
  });

  useEffect(() => {
    const permis = localStorage.getItem("permis");
    if (!permis) {
      Notification.requestPermission()
        .then((perm) => {
          if (permis === "denied") {
            localStorage.setItem("permis", perm);
            return;
          }
          const date = new Date(new Date() - 3 * 60000);
          const noti = notifis.find(
            (item) => item.updatedAt > date && !item.idRead
          );
          if (noti) {
            new Notification("Thông báo từ fluxquiz", {
              body: `${noti.content}`,
            });
          }
          localStorage.setItem("permis", perm);
        })
        .catch((err) => console.log(err));
    } else if (permis === "denied") {
      return;
    } else {
      const currentDatetime = new Date();
      const date = new Date(currentDatetime - 3 * 60000);

      const noti = notifis?.find(
        (item) => !item.isRead && date.toISOString() < item.updatedAt
      );
      if (noti) {
        new Notification("Thông báo từ fluxquiz", {
          data: `${noti.content}`,
        });
      }
    }
  }, [isFetching]);

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
  if (isLoading) return <p>Loading....</p>;

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
        {!isLoading && (
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
                  <span>{moment(item.createdAt, "YYYYMMDD").fromNow()}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifi;
