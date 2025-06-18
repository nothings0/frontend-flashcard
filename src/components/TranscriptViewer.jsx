import { useEffect, useRef } from "react";

const TranscriptViewer = ({ showTranscript, setShowTranscript, subtitles, playerRef, currentTime }) => {
  const itemsRef = useRef([]);

  const handlePlaySubtitle = (sTime) => {
    if (playerRef.current) {
      console.log(sTime);
      
      playerRef.current.seekTo(sTime / 1000 > 1 ? sTime / 1000 : 0); // Convert ms to seconds
      playerRef.current.getInternalPlayer().playVideo();
    }
  };

  useEffect(() => {
    if (showTranscript && subtitles.length > 0) {
      const activeIndex = subtitles.findIndex(
        (sub) =>
          sub.sTime <= currentTime * 1000 && currentTime * 1000 <= sub.eTime
      );
      if (activeIndex !== -1 && itemsRef.current[activeIndex]) {
        itemsRef.current[activeIndex].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [currentTime, subtitles, showTranscript]);

  return (
    <div className="transcript-viewer">
      {showTranscript && (
        <ul className="transcript-list">
          {subtitles.map((subtitle, index) => {
            const isActive =
              subtitle.sTime <= currentTime * 1000 &&
              currentTime * 1000 <= subtitle.eTime;
            return (
              <li
                key={index}
                className={`transcript-item ${isActive ? "active" : ""}`}
                ref={(el) => (itemsRef.current[index] = el)}
              >
                <button
                  className="transcript-play-btn"
                  onClick={() => handlePlaySubtitle(subtitle.sTime)}
                >
                  <i className="fa fa-play"></i>
                </button>
                <span className="transcript-text">{subtitle.text}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TranscriptViewer;
