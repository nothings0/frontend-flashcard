import React, { useState, useEffect } from "react";

function Countdown({ time, setShowCountdown, type }) {
  const [seconds, setSeconds] = useState(Math.round(time / 1000));

  useEffect(() => {
    let timerId;

    if (seconds > 0) {
      timerId = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);

      // Dọn dẹp khi component bị hủy
    } else {
      setShowCountdown((isCD) => {
        if (isCD === 1) return 2;
        else return 1;
      });
    }
    return () => clearTimeout(timerId);
  }, [seconds]);

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
