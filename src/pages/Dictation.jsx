import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useLyric from "../Hook/useLyric";
import { GetVideoTed } from "../redux/lyricApi";
import ReactPlayer from "react-player/youtube";
import Search from "../components/Search";
import Skeleton from "../components/Skeleton";

const LyricPractice = () => {
  const { slug } = useParams();
  const playerRef = useRef();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.middle);

  const [youtubeId, setYoutubeId] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [durationC, setDurationC] = useState(0);
  const [time, setTime] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [displayText, setDisplayText] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const res = useLyric(slug, time);

  // Memoize sentences to ensure stable reference
  const sentences = useMemo(() => res?.flat() || [], [res]);

  useEffect(() => {
    const getVideo = async () => {
      const result = await GetVideoTed(slug, dispatch);
      setDurationC(JSON.parse(result.video.playerData).duration);
      const youtube = JSON.parse(result.video.playerData).external.code;
      setYoutubeId(youtube);
    };
    getVideo();
  }, [slug, dispatch]);

  useEffect(() => {
    if (Math.abs(durationC - duration) <= 2) {
      setTime(false);
    } else {
      setTime(true);
    }
  }, [durationC, duration]);

  // Initialize displayText only when sentence changes
  useEffect(() => {
    if (sentences.length > 0 && currentSentenceIndex < sentences.length) {
      const currentSentence = sentences[currentSentenceIndex];
      const words = currentSentence.text.split(" ");
      setDisplayText(
        words.map((word) => ({ text: "*".repeat(word.length), color: "black" }))
      );
    }
  }, [currentSentenceIndex, sentences]);

  // Handle playback based on currentTime
  useEffect(() => {
    if (sentences.length > 0 && currentSentenceIndex < sentences.length) {
      const currentSentence = sentences[currentSentenceIndex];
      if (
        currentSentence.sTime <= currentTime * 1000 &&
        currentTime * 1000 <= currentSentence.eTime
      ) {
        if (!isPlaying) {
          setIsPlaying(true);
        }
      } else if (isPlaying && currentTime * 1000 > currentSentence.eTime) {
        setIsPlaying(false);
      }
    }
  }, [currentTime, currentSentenceIndex, sentences, isPlaying]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && document.activeElement.tagName === "TEXTAREA") {
        e.preventDefault();
        handleCheck();
      } else if (e.ctrlKey) {
        e.preventDefault();
        handlePlay();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSentenceIndex, sentences, userInput, isPlaying]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);
  };

  const handleCheck = () => {
    const currentSentence = sentences[currentSentenceIndex].text;
    const input = userInput.trim().toLowerCase();
    const correctWords = currentSentence.toLowerCase().split(" ");
    const inputWords = input.split(" ");

    if (input.toLowerCase() === currentSentence.toLowerCase()) {
      // Correct full input: show all words in green and move to next sentence
      setDisplayText(
        correctWords.map((word) => ({ text: word, color: "green" }))
      );
      setTimeout(() => {
        if (currentSentenceIndex < sentences.length - 1) {
          setCurrentSentenceIndex(currentSentenceIndex + 1);
          setUserInput("");
          const nextWords = sentences[currentSentenceIndex + 1].text.split(" ");
          setDisplayText(
            nextWords.map((word) => ({ text: "*".repeat(word.length), color: "black" }))
          );
          playerRef.current.seekTo(
            sentences[currentSentenceIndex + 1].sTime / 1000
          );
        } else {
          setIsPlaying(false);
        }
      }, 1000);
    } else {
      const display = [];
      let i = 0;
      // Compare input words with correct words
      for (; i < inputWords.length && i < correctWords.length; i++) {
        if (inputWords[i].toLowerCase() === correctWords[i].toLowerCase()) {
          display.push({ text: correctWords[i], color: "green" });
        } else {
          // Show incorrect input padded with asterisks
          const paddedInput = inputWords[i] + "*".repeat(Math.max(0, correctWords[i].length - inputWords[i].length));
          display.push({ text: paddedInput, color: "red", underline: true });
          break; // Stop at first incorrect word
        }
      }
      // If all input words are correct so far, show hint for next word
      if (i === inputWords.length && i < correctWords.length) {
        const nextWord = correctWords[i];
        const hint = nextWord[0] + "*".repeat(nextWord.length - 1);
        display.push({ text: hint, color: "blue" });
        i++;
      }
      // Add remaining words as asterisks
      for (; i < correctWords.length; i++) {
        display.push({ text: "*".repeat(correctWords[i].length), color: "black" });
      }
      setDisplayText(display);
    }
  };

  const handlePlay = () => {
    if (sentences.length > 0 && currentSentenceIndex < sentences.length) {
      playerRef.current.seekTo(sentences[currentSentenceIndex].sTime / 1000);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
      setUserInput("");
      const prevWords = sentences[currentSentenceIndex - 1].text.split(" ");
      setDisplayText(
        prevWords.map((word) => ({ text: "*".repeat(word.length), color: "black" }))
      );
      playerRef.current.seekTo(sentences[currentSentenceIndex - 1].sTime / 1000);
      setIsPlaying(true);
    }
  };

  const handleSkip = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
      setUserInput("");
      const nextWords = sentences[currentSentenceIndex + 1].text.split(" ");
      setDisplayText(
        nextWords.map((word) => ({ text: "*".repeat(word.length), color: "black" }))
      );
      playerRef.current.seekTo(
        sentences[currentSentenceIndex + 1].sTime / 1000
      );
      setIsPlaying(true);
    }
  };

  return (
    <div className="lyric-main">
      <Search />
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <div className="lyric-main__video">
            <ReactPlayer
              url={`https://www.youtube.com/embed/${youtubeId}?showinfo=0&enablejsapi=1&origin=http://fluxquiz.vercel.app`}
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0,
                    controls: 0,
                  },
                },
              }}
              onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
              ref={playerRef}
              width="100%"
              height={400}
              playing={isPlaying}
              controls={false}
              className="react-player-video"
              onDuration={(du) => setDuration(du)}
            />
          </div>
          <div className="lyric-main__input">
            <div className="lyric-main__input__control">
              <button className="bg-outline" onClick={handlePlay}>
                <i className="fa fa-play"></i>
              </button>
              <div className="flex">
                <i
                  className={`fa fa-arrow-left ${currentSentenceIndex === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  onClick={currentSentenceIndex > 0 ? handlePrevious : undefined}
                ></i>
                <span>{currentSentenceIndex + 1}/{sentences.length}</span>
                <i
                  className={`fa fa-arrow-right ${currentSentenceIndex === sentences.length - 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  onClick={currentSentenceIndex < sentences.length - 1 ? handleSkip : undefined}
                ></i>
              </div>
            </div>
            <textarea
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type what you hear..."
              rows={3}
            />
            <div className="flex">
              <button
                onClick={handleCheck}
                className="bg-primary"
              >
                Check
              </button>
              <button
                onClick={handleSkip}
                className="bg-outline"
              >
                Skip
              </button>
            </div>
            <div className="sentences">
              {displayText.map((item, index) => (
                <span
                  key={index}
                  style={{
                    color: item.color,
                    marginRight: "5px",
                    textDecoration: item.underline ? "underline" : "none",
                  }}
                >
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LyricPractice;