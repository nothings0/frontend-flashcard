import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getExerciseById } from "../redux/apiRequest";
import ReactPlayer from "react-player/youtube";
import Search from "../components/Search";
import Skeleton from "../components/Skeleton";
import TranscriptViewer from "../components/TranscriptViewer";

const LyricPractice = () => {
  const { slug } = useParams();
  const playerRef = useRef();

  const [loading, setLoading] = useState(true);
  const [youtubeId, setYoutubeId] = useState("");
  const [subtitles, setSubtitles] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [displayText, setDisplayText] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const exercise = await getExerciseById(slug);
        const subtitleData = exercise.subtitle;
        // Process subtitles
        const processedSubtitles = [];

        subtitleData.forEach((sub, index) => {
          const line = sub.text.replace(/\n/g, " ").trim();
          processedSubtitles.push({
            text: line.trim(),
            sTime: sub.time * 1000, // Convert seconds to milliseconds
            eTime:
              index < subtitleData.length - 1
                ? subtitleData[index + 1].time * 1000
                : (sub.time + 5) * 1000, // Next time or +5s
          });
        });

        setSubtitles(processedSubtitles);

        // Temporary: Derive youtubeId from slug (e.g., extract "VRAlpK8IGLE")
        const thumbnailUrl = exercise.thumbnail;
        const idMatch = thumbnailUrl.match(/\/vi\/([a-zA-Z0-9_-]+)/);
        setYoutubeId(idMatch ? idMatch[1] : "");
      } catch (error) {
        console.error("Failed to fetch exercise:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [slug]);

  // Initialize displayText when sentence changes
  useEffect(() => {
    if (subtitles.length > 0 && currentSentenceIndex < subtitles.length) {
      const words = subtitles[currentSentenceIndex].text.split(" ");
      setDisplayText(
        words.map((word) => ({ text: "*".repeat(word.length), color: "black" }))
      );
    }
  }, [currentSentenceIndex, subtitles]);

  // Handle playback based on currentTime
  useEffect(() => {
    if (subtitles.length > 0 && currentSentenceIndex < subtitles.length) {
      const currentSentence = subtitles[currentSentenceIndex];
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
  }, [currentTime, currentSentenceIndex, subtitles, isPlaying]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && document.activeElement.tagName === "TEXTAREA") {
        e.preventDefault();
        handleCheck();
      } else if (e.altKey) {
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
  }, [currentSentenceIndex, subtitles, userInput, isPlaying]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);
  };

  const handleCheck = () => {
    const currentSentence = subtitles[currentSentenceIndex]?.text || '';
    const input = userInput.trim().toLowerCase();
    if (!input) {
      setDisplayText([]);
      return;
    }

    const correctWords = currentSentence.toLowerCase().split(' ');
    const inputWords = input.split(' ');

    const handleCorrectInput = () => {
      setDisplayText(correctWords.map((word) => ({ text: word, color: 'green' })));
      setShowAnswer(true);
      setTimeout(() => {
        if (currentSentenceIndex < subtitles.length - 1) {
          const nextIndex = currentSentenceIndex + 1;
          const nextWords = subtitles[nextIndex].text.split(' ');
          setCurrentSentenceIndex(nextIndex);
          setUserInput('');
          setShowAnswer(false);
          setDisplayText(
            nextWords.map((word) => ({ text: '*'.repeat(word.length), color: 'black' }))
          );
          playerRef.current?.seekTo(subtitles[nextIndex].sTime / 1000);
        } else {
          setIsPlaying(false);
        }
      }, 1000);
    };

    const handleIncorrectInput = () => {
      const display = [];
      let i = 0;

      while (i < inputWords.length && i < correctWords.length) {
        const inputWord = inputWords[i];
        const correctWord = correctWords[i];

        if (inputWord === correctWord) {
          display.push({ text: correctWord, color: 'green' });
        } else if (correctWord.startsWith(inputWord)) {
          const remainingLength = correctWord.length - inputWord.length;
          const parts = [
            { text: inputWord, color: 'green' },
            { text: '*'.repeat(remainingLength), color: 'red', underline: true },
          ].filter((part) => part.text);
          display.push({ parts });
          i++; // Move to next word
          break;
        } else {
          let commonPrefixLength = 0;
          while (
            commonPrefixLength < inputWord.length &&
            commonPrefixLength < correctWord.length &&
            inputWord[commonPrefixLength] === correctWord[commonPrefixLength]
          ) {
            commonPrefixLength++;
          }

          const prefix = inputWord.slice(0, commonPrefixLength);
          const suffix = inputWord.slice(commonPrefixLength);
          const remainingLength = correctWord.length - (prefix.length + suffix.length);
          const parts = [];

          if (prefix) parts.push({ text: prefix, color: 'green' });
          if (suffix) parts.push({ text: suffix, color: 'red', underline: true });
          if (remainingLength > 0) parts.push({ text: '*'.repeat(remainingLength), color: 'red', underline: true });

          if (parts.length > 0) {
            display.push({ parts });
          } else {
            display.push({ text: inputWord, color: 'red', underline: true });
          }
          i++; // Move to next word
          break;
        }
        i++;
      }

      // Only show hint if all input words are fully correct
      if (i === inputWords.length && i < correctWords.length && i === display.filter(item => item.text && item.color === 'green').length) {
        const nextWord = correctWords[i];
        const hint = nextWord[0] + '*'.repeat(nextWord.length - 1);
        display.push({ text: hint, color: 'blue' });
        i++;
      }

      // Add black asterisks for remaining words
      while (i < correctWords.length) {
        display.push({ text: '*'.repeat(correctWords[i].length), color: 'black' });
        i++;
      }

      setDisplayText(display);
      setShowAnswer(false);
    };

    if (input === currentSentence.toLowerCase()) {
      handleCorrectInput();
    } else {
      handleIncorrectInput();
    }
  };

  const handlePlay = () => {
    if (subtitles.length > 0 && currentSentenceIndex < subtitles.length) {
      const timeSeek = subtitles[currentSentenceIndex].sTime / 1000 > 1 ? subtitles[currentSentenceIndex].sTime / 1000 : 0;
      playerRef.current.seekTo(timeSeek);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
      setUserInput("");
      const prevWords = subtitles[currentSentenceIndex - 1].text.split(" ");
      setDisplayText(
        prevWords.map((word) => ({
          text: "*".repeat(word.length),
          color: "black",
        }))
      );
      playerRef.current.seekTo(
        subtitles[currentSentenceIndex - 1].sTime / 1000
      );
      setIsPlaying(true);
    }
  };

  const handleSkip = () => {
    if (currentSentenceIndex < subtitles.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
      setUserInput("");
      const nextWords = subtitles[currentSentenceIndex + 1].text.split(" ");
      setDisplayText(
        nextWords.map((word) => ({
          text: "*".repeat(word.length),
          color: "black",
        }))
      );
      playerRef.current.seekTo(
        subtitles[currentSentenceIndex + 1].sTime / 1000
      );
      setIsPlaying(true);
    }
  };

  const handleShowAnswer = () => {
    const currentSentence = subtitles[currentSentenceIndex].text;
    const correctWords = currentSentence.split(" ");
    if (showAnswer) {
      setDisplayText(
        correctWords.map((word) => ({
          text: "*".repeat(word.length),
          color: "black",
        }))
      );
    } else {
      setDisplayText(
        correctWords.map((word) => ({ text: word, color: "green" }))
      );
    }
    setShowAnswer(!showAnswer);
  };

  return (
    <>
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
                      controls: 1,
                    },
                  },
                }}
                onProgress={({ playedSeconds }) =>
                  setCurrentTime(playedSeconds)
                }
                ref={playerRef}
                width="100%"
                height={400}
                playing={isPlaying}
                className="react-player-video"
              />
            </div>
            <div className="lyric-main__input">
              <div className="lyric-main__input__button">
                <div
                  className={showTranscript ? "" : "active"}
                  onClick={() => setShowTranscript(!showTranscript)}
                >
                  Dictation
                </div>
                <div
                  className={showTranscript ? "active" : ""}
                  onClick={() => setShowTranscript(!showTranscript)}
                >
                  Transcript
                </div>
              </div>
              {showTranscript ? (
                <TranscriptViewer
                  showTranscript={showTranscript}
                  setShowTranscript={setShowTranscript}
                  subtitles={subtitles}
                  playerRef={playerRef}
                  currentTime={currentTime}
                />
              ) : (
                <div className="lyric-main__input__wrap">
                  <div className="lyric-main__input__control">
                    <button className="bg-outline" onClick={handlePlay}>
                      {isPlaying ? (
                        <i className="fa fa-pause"></i>
                      ) : (
                        <i className="fa fa-play"></i>
                      )}
                    </button>
                    <div className="flex">
                      <i
                        className={`fa fa-arrow-left ${
                          currentSentenceIndex === 0
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={
                          currentSentenceIndex > 0 ? handlePrevious : undefined
                        }
                      ></i>
                      <span>
                        {currentSentenceIndex + 1}/{subtitles.length}
                      </span>
                      <i
                        className={`fa fa-arrow-right ${
                          currentSentenceIndex === subtitles.length - 1
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={
                          currentSentenceIndex < subtitles.length - 1
                            ? handleSkip
                            : undefined
                        }
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
                    <button onClick={handleCheck} className="bg-primary">
                      Check
                    </button>
                    <button onClick={handleSkip} className="bg-outline">
                      Skip
                    </button>
                    <button onClick={handleShowAnswer} className="bg-outline">
                      Show Answer
                    </button>
                  </div>
                  <div className="sentences">
                    {displayText.map((item, index) => (
                      <span key={index} style={{ marginRight: "5px" }}>
                        {item.parts ? (
                          item.parts.map((part, partIndex) => (
                            <span
                              key={partIndex}
                              style={{
                                color: part.color,
                                textDecoration: part.underline
                                  ? "underline"
                                  : "none",
                              }}
                            >
                              {part.text}
                            </span>
                          ))
                        ) : (
                          <span
                            style={{
                              color: item.color,
                              textDecoration: item.underline
                                ? "underline"
                                : "none",
                            }}
                          >
                            {item.text}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LyricPractice;
