import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { GetTedTranslation } from '../redux/lyricApi'
import { getRandomArbitrary } from "../util"

const useLyric = ( slug ) => {
  const [lyr, setLyr] = useState()
  const dispatch = useDispatch()
  useEffect(() => {
    (
      async () => {
        if(slug !== null && slug !== "") {

          const res = await GetTedTranslation(slug, dispatch)
          let customLyr = []
          const paragraphs = res.translation.paragraphs
          for(let i = 0; i < paragraphs.length; i++) {
            let dataArr = []
            let lyric
            let sTime = 0
            let eTime = 0
            let cues = paragraphs[i].cues
            for(let j = 0; j < cues.length; j++){
                if(j === cues.length - 1) {
                  if(i === paragraphs.length - 1){
                    eTime = cues[j].time + 2999
                  }else{
                    eTime = paragraphs[i + 1].cues[0].time + 2999
                  }
                }else{
                  eTime = cues[j + 1].time + 2999
                }
                lyric = cues[j].text.split(/[\s\n\r,]+/)
                lyric = lyric.filter(e => e !== '')
                let answer = ""
                if(lyric.length >= 4){
                  const idx = getRandomArbitrary(0, lyric.length - 1)
                  answer = lyric[idx]
                  lyric[idx] = ''
                }
                sTime = cues[j].time + 3000
                dataArr.push({
                  text: lyric,
                  sTime,
                  eTime,
                  answer
                })
            }
            customLyr.push(dataArr)
          }
          setLyr(customLyr)
        }
      }
    )()
  }, [slug])

  return lyr

}

export default useLyric