import React, { useEffect, useState } from "react";
import { socket } from "../../socket.js";
import { useNavigate, useParams } from "react-router-dom";
import Helmet from "../../components/Helmet.jsx";
import Search from "../../components/Search.jsx";
import WaitRoom from "./waitRoom.jsx";

const QuizLive = () => {
  const { roomId: roomIdParams } = useParams();
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState(roomIdParams ? roomIdParams : "");
  const [msg, setMsg] = useState("");
  const [isRedirect, setRedirect] = useState(false);
  const [socketProps, setSocketProps] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();
    const userLive = JSON.parse(sessionStorage.getItem("user-live"));
    if (userLive) {
      socket.emit("rejoin-room", userLive.roomId);
      navigate(`/live/${userLive.roomId}`);
      setRedirect(true);
    }
    setSocketProps(socket);
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    socket.emit("join-room", { username, roomId });
    socket.on("joined-room", ({ success }) => {
      if (success) {
        sessionStorage.setItem(
          "user-live",
          JSON.stringify({ roomId, username })
        );
        navigate(`/live/${roomId}`);
        setRedirect(true);
      }
    });
    socket.on("error", (payload) => {
      setMsg(payload);
    });
  };

  return (
    <Helmet title="Live | Flux">
      <Search />
      <div className="quiz quiz-live">
        <div className="quiz__container">
          {!isRedirect ? (
            <>
              {roomIdParams ? (
                <form className="form-min">
                  <input
                    type="text"
                    placeholder="Nhập tên của bạn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <button onClick={handleJoin} type="submit">
                    join room
                  </button>
                </form>
              ) : (
                <form>
                  <input
                    type="text"
                    placeholder="Nhập room id"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="roomid"
                    maxLength={6}
                  />
                  <input
                    type="text"
                    placeholder="Nhập tên của bạn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <button onClick={handleJoin} type="submit">
                    Join
                  </button>
                </form>
              )}
              <div>{msg}</div>
            </>
          ) : (
            <>
              <WaitRoom socket={socketProps} />
            </>
          )}
        </div>
      </div>
    </Helmet>
  );
};

export default QuizLive;
