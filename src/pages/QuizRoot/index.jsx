import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../socket.js";
import Helmet from "../../components/Helmet.jsx";
import Search from "../../components/Search.jsx";
import QuizUser from "./QuizUser.jsx";
import LiveRoom from "../QuizLive/LiveRoom.jsx";
import LiveRoot from "./LiveRoot.jsx";

const QuizRoot = () => {
  const [roomId, setRoomId] = useState("");
  const [members, setMembers] = useState([]);
  const [isLive, setLive] = useState(false);

  const userId = useSelector((state) => state.user.currentUser?.user._id);

  useEffect(() => {
    socket.connect();

    const roomLive = JSON.parse(sessionStorage.getItem("room-live"));
    const qrcodeHTML = document.getElementById("qrcode");
    socket.on("connect", () => {
      if (roomLive) {
        socket.emit("rejoin-room", roomLive.roomId);
        socket.on("joined-room", (status) => {
          setRoomId(roomLive.roomId);
          if (status === "success") {
            qrcodeHTML.innerHTML = roomLive.qrcode;
            socket.emit("get-members", roomLive.roomId);
          } else if (status === "navigate") {
            setLive(true);
          }
        });
      } else {
        socket.emit("create-room", userId);
        socket.on("room-created", ({ roomId, qrcode }) => {
          setRoomId(roomId);
          qrcodeHTML.innerHTML = qrcode;
          sessionStorage.setItem(
            "room-live",
            JSON.stringify({ roomId, qrcode })
          );
          socket.emit("get-members", roomId);
        });
      }
      socket.on("members", (members) => {
        setMembers(members);
      });
    });

    return () => {
      socket.off("room-created");
      socket.off("get-members");
      socket.off("members");
      socket.off("new-room");
    };
  }, []);

  const handleCreateNewRoom = () => {
    sessionStorage.removeItem("room-live");
    socket.emit("new-room", userId);
    const qrcodeHTML = document.getElementById("qrcode");
    socket.on("room-created", ({ roomId, qrcode }) => {
      setRoomId(roomId);
      qrcodeHTML.innerHTML = qrcode;
      sessionStorage.setItem("room-live", JSON.stringify({ roomId, qrcode }));
      socket.emit("get-members", roomId);
    });
  };

  const startQuiz = () => {
    socket.emit("start", roomId);
    socket.on("started", () => {
      setLive(true);
    });
  };

  return (
    <Helmet title="Live | Flux">
      <Search />
      <div className="quiz quiz-root">
        <div className="quiz__container">
          {isLive ? (
            <LiveRoot socket={socket} roomId={roomId} />
          ) : (
            <>
              <div className="quiz__join">
                <div className="quiz__join__link">
                  <div className="quiz__join--title">
                    fluxquiz.netlify.app/live
                  </div>
                  <div className="quiz__join__link--code">{roomId}</div>
                </div>
                <div className="quiz__join__qrcode">
                  <div className="quiz__join--title">Quét mã QR</div>
                  <div className="quiz__join__qrcode--code" id="qrcode"></div>
                </div>
                <div className="quiz__join__recreate">
                  <div
                    className="quiz__join__recreate--btn"
                    onClick={handleCreateNewRoom}
                  >
                    Tạo phòng mới
                  </div>
                </div>
              </div>
              <div className="quiz__lobby">
                <div className="quiz__lobby__header">
                  <div className="quiz__lobby__header--text">
                    {members.length < 2
                      ? `Đang chờ thêm ${members.length + 2} + người chơi`
                      : `Có ${members.length} người chơi`}
                  </div>
                  <div className="quiz__lobby__header--btn">
                    <button onClick={startQuiz}>Tạo trò chơi</button>
                  </div>
                </div>
                <div className="quiz__lobby__container">
                  <div className="quiz__user__container">
                    {members.map((item) => (
                      <QuizUser user={item} key={item._id} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Helmet>
  );
};

export default QuizRoot;
