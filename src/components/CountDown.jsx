import React, { useState, useEffect } from "react";

function Countdown({ time, setShowCountdown, type }) {
  const [seconds, setSeconds] = useState(Math.ceil(time / 1000));

  useEffect(() => {
    let timerId;

    if (seconds > 1) {
      timerId = setTimeout(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 1) {
      // Đợi 1 giây rồi gọi setShowCountdown, không hiển thị 0
      timerId = setTimeout(() => {
        setShowCountdown((isCD) => (isCD === 1 ? 2 : 1));
      }, 1000);
    }

    return () => clearTimeout(timerId);
  }, [seconds, setShowCountdown]);

  return (
    <>
      {type ? (
        <div className="count-down-head">
          <div className="times">{seconds}</div>
        </div>
      ) : (
        <div className="count-down">
          <div className="times">{seconds}</div>
        </div>
      )}
    </>
  );
}

export default Countdown;
