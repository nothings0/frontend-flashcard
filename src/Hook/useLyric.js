import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GetTedTranslation } from "../redux/lyricApi";

const useLyric = (slug, time) => {
  const [lyr, setLyr] = useState();
  const timeIntro = time ? 3100 : 0;
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (slug !== null && slug !== "") {
        const res = await GetTedTranslation(slug, dispatch);
        let customLyr = [];
        const paragraphs = res.translation.paragraphs;
        for (let i = 0; i < paragraphs.length; i++) {
          let dataArr = [];
          let sTime = 0;
          let eTime = 0;
          let cues = paragraphs[i].cues;
          for (let j = 0; j < cues.length; j++) {
            // Skip meaningless lyrics like "(Laughter)" or containing parentheses
            const text = cues[j].text;
            if (text.includes("(Laughter)") || text.includes("(") || text.includes(")")) {
              continue;
            }
            // Join words into a single string, removing extra spaces and punctuation
            let lyric = cues[j].text
              .split(/[\s\n\r,]+/)
              .filter((e) => e !== "")
              .join(" ");
            if (j === cues.length - 1) {
              if (i === paragraphs.length - 1) {
                eTime = cues[j].time + timeIntro;
              } else {
                eTime = paragraphs[i + 1].cues[0].time + timeIntro;
              }
            } else {
              eTime = cues[j + 1].time + timeIntro;
            }
            sTime = cues[j].time + timeIntro;
            dataArr.push({
              text: lyric,
              sTime,
              eTime,
            });
          }
          if (dataArr.length > 0) {
            customLyr.push(dataArr);
          }
        }
        setLyr(customLyr);
      }
    })();
  }, [slug, timeIntro]);

  return lyr;
};

export default useLyric;