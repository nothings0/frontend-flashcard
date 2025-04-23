import React, { useEffect, useState } from "react";
import QuizUser from "../QuizRoot/QuizUser";
import { useParams } from "react-router-dom";

const WaitRoom = ({ socket }) => {
  const [members, setMembers] = useState([]);

  const { roomId } = useParams();

  useEffect(() => {
    socket?.emit("get-members", roomId);
    socket?.on("members", (members) => {
      setMembers(members);
    });

    return () => {
      socket.off("members");
      socket.off("get-members");
    };
  }, [socket]);

  return (
    <div className="wait-room">
      <div className="quiz__user__container">
        {members.map((item) => (
          <QuizUser user={item} key={item._id} />
        ))}
      </div>
    </div>
  );
};

export default WaitRoom;
