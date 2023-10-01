import React, { useEffect, useState } from "react";
import QuizUser from "../QuizRoot/QuizUser";
import { useParams } from "react-router-dom";
import LiveRoom from "./LiveRoom";

const WaitRoom = ({ socket }) => {
  const [members, setMembers] = useState([]);
  const [isLive, setLive] = useState(false);

  const { roomId } = useParams();

  useEffect(() => {
    if (!isLive) {
      socket?.emit("get-members", roomId);
      socket?.on("members", (members) => {
        setMembers(members);
      });
    }

    console.log("aa");
    socket?.on("quiz", (quiz) => {
      console.log("a");
      setLive(true);
    });

    return () => {
      socket.off("members");
      socket.off("quiz");
      socket.off("get-members");
    };
  }, [socket]);

  return (
    <div className="wait-room">
      <div className="quiz__user__container">
        {!isLive ? (
          <>
            {members.map((item) => (
              <QuizUser user={item} key={item._id} />
            ))}
          </>
        ) : (
          <>
            <LiveRoom socket={socket} roomId={roomId} />
          </>
        )}
      </div>
    </div>
  );
};

export default WaitRoom;
