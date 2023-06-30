import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useLyric from "../Hook/useLyric";
import { GetVideoTed } from "../redux/lyricApi";
import ReactPlayer from "react-player/youtube";
import Input from "../components/Input";
import Search from "../components/Search";
import Skeleton from "../components/Skeleton";

const LyricMain = () => {
  const { slug } = useParams();
  const res = useLyric(slug);
  const playerRef = useRef();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.middle);

  const [youtubeId, setYoutubeId] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [answerArr, setAnswerArr] = useState([]);
  const [resultArr, setResultArr] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const getVideo = async () => {
      const result = await GetVideoTed(slug, dispatch);
      const youtube = JSON.parse(result.video.playerData).external.code;
      setYoutubeId(youtube);
    };
    getVideo();
    if (res?.length > 0) {
      let initState = [];
      for (let i = 0; i < res.length; i++) {
        let array = [];
        for (let j = 0; j < res[i].length; j++) {
          let answer = "";
          array.push(answer);
        }
        initState.push(array);
      }
      setAnswerArr(initState);
    }
  }, [slug, res]);

  const handleAnswer = (e, l, s) => {
    const newArr = [...answerArr];

    newArr[l][s] = e.target.value;
    setAnswerArr(newArr);
  };

  const handleSubmit = (answerArr) => {
    if (!isSubmit) {
      let result = [];
      for (let i = 0; i < answerArr.length; i++) {
        let array = [];
        for (let j = 0; j < answerArr[i].length; j++) {
          let rusultItem = {
            result: false,
            correct: "",
          };
          if (
            answerArr[i][j].toLowerCase() === res[i][j].answer.toLowerCase()
          ) {
            rusultItem.result = true;
          } else {
            rusultItem.result = false;
            rusultItem.correct = res[i][j].answer;
          }
          array.push(rusultItem);
        }
        result.push(array);
      }
      setResultArr(result);
      setIsSubmit(true);
      setIsPlaying(false);
    } else {
      setResultArr([]);
      setIsSubmit(false);
      setAnswerArr([]);
      setCurrentTime(0);
      playerRef.current.seekTo(0);
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
              url={`https://www.youtube.com/embed/${youtubeId}?showinfo=0&enablejsapi=1&origin=http://fluxquiz.com`}
              config={{
                youtube: {
                  playerVars: { cc_load_policy: 0, showinfo: 1 },
                },
              }}
              onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
              ref={playerRef}
              width={580}
              height={400}
              playing={isPlaying}
              controls={true}
              className="react-player-video"
            />
          </div>
          <div className="lyric-main__translation">
            <div className="lyric-main__translation__wrap">
              {res?.map((e, index) => {
                if (isSubmit) {
                  if (
                    e[0].sTime - 2000 <= currentTime * 1000 &&
                    currentTime * 1000 <= e[e.length - 1].eTime + 2000
                  ) {
                    let lineActive = document.querySelector(
                      ".lyric-main__line.active"
                    );
                    lineActive?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                  return (
                    <div
                      id={`line-${index}`}
                      key={index}
                      className={`lyric-main__line ${
                        e[0].sTime <= currentTime * 1000 &&
                        currentTime * 1000 <= e[e.length - 1].eTime
                          ? "active"
                          : ""
                      }`}
                    >
                      {e.map((item, index2) => {
                        return (
                          <span
                            key={index2}
                            className={`sentence ${
                              item.sTime <= currentTime * 1000 &&
                              currentTime * 1000 <= item.eTime
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              setIsPlaying(true);
                              playerRef.current.seekTo(item.sTime / 1000);
                            }}
                          >
                            {item.text.map((i, idx) => {
                              if (i === "") {
                                return (
                                  <Input
                                    length={item.answer.length}
                                    key={idx}
                                    line={index}
                                    sentence={index2}
                                    answer={
                                      answerArr.length > 0 &&
                                      answerArr[index][index2] !== ""
                                        ? answerArr[index][index2]
                                        : resultArr[index][index2].correct
                                    }
                                    result={
                                      resultArr.length > 0
                                        ? resultArr[index][index2]
                                        : undefined
                                    }
                                  />
                                );
                              } else {
                                return (
                                  <span key={idx} className="sentence__item">
                                    {i}
                                  </span>
                                );
                              }
                            })}
                          </span>
                        );
                      })}
                    </div>
                  );
                } else {
                  if (e[0].sTime - 5000 <= currentTime * 1000) {
                    if (
                      e[0].sTime - 2000 <= currentTime * 1000 &&
                      currentTime * 1000 <= e[e.length - 1].eTime + 2000
                    ) {
                      let lineActive = document.querySelector(
                        ".lyric-main__line.active"
                      );
                      lineActive?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                    return (
                      <div
                        id={`line-${index}`}
                        key={index}
                        className={`lyric-main__line ${
                          e[0].sTime <= currentTime * 1000 &&
                          currentTime * 1000 <= e[e.length - 1].eTime
                            ? "active"
                            : ""
                        }`}
                      >
                        {e.map((item, index2) => {
                          return (
                            <span
                              key={index2}
                              className={`sentence ${
                                item.sTime <= currentTime * 1000 &&
                                currentTime * 1000 <= item.eTime
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() => {
                                setIsPlaying(true);
                                playerRef.current.seekTo(item.sTime / 1000);
                              }}
                            >
                              {item.text.map((i, idx) => {
                                if (i === "") {
                                  return (
                                    <Input
                                      length={item.answer.length}
                                      key={idx}
                                      line={index}
                                      sentence={index2}
                                      handleAnswer={handleAnswer}
                                      answer={
                                        answerArr.length > 0
                                          ? answerArr[index][index2]
                                          : ""
                                      }
                                      active={
                                        item.sTime <= currentTime * 1000 &&
                                        currentTime * 1000 <= item.eTime
                                          ? true
                                          : false
                                      }
                                      sTime={item.sTime}
                                      eTime={item.eTime}
                                      playerRef={playerRef}
                                      setIsPlaying={setIsPlaying}
                                      currentTime={currentTime}
                                    />
                                  );
                                } else {
                                  return (
                                    <span key={idx} className="sentence__item">
                                      {i}
                                    </span>
                                  );
                                }
                              })}
                            </span>
                          );
                        })}
                      </div>
                    );
                  }
                }
              })}
            </div>
          </div>
          <div
            className="lyric-main__submit"
            onClick={() => handleSubmit(answerArr)}
          >
            {isSubmit ? (
              <>
                <span>Reload</span>
                <i class="fa-solid fa-rotate-right"></i>
              </>
            ) : (
              <>
                <span>Submit</span>
                <i className="fa-solid fa-check"></i>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LyricMain;
