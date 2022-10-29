import React, {useState, useEffect, useRef } from 'react'
import { GetSongIndex, GetSong } from '../redux/apiRequest'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentTime, setIsPlay, setCheck } from '../redux/audioSlice'
import { useLocation } from 'react-router-dom'
import { GetInfoSong } from '../redux/audioApi'

const ava = require('../assets/Profile.png')

const Music = ({indexSong}) => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()

  const [currentSong, setCurrentSong] = useState('')
  const [titleSong, setTitleSong] = useState('')
  const [avaSong, setAvaSong] = useState('')

  const audioRef = useRef()
  const inputRef = useRef()

  const currentTime = useSelector(state => state.audio.currentTime)
  const check = useSelector(state => state.audio.check)
  const isPlay = useSelector(state => state.audio.isPlay)

  useEffect(() => {
    const getData = async () => {
      if(indexSong){
        const res = await GetSong(indexSong)
        const res2 = await GetInfoSong(indexSong)
        setTitleSong(res2.title)
        setAvaSong(res2.thumbnailM)
        setCurrentSong(res.data[128])
      }
    }
    getData()
  }, [indexSong])

  useEffect(() => {
    if (isPlay) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlay])

  useEffect(() => {
    if(!check){
      audioRef.current.currentTime = currentTime - 3
      dispatch(setCheck(!check))
    }
  }, [check])

  const handlePausePlayClick = () => {
    dispatch(setIsPlay(!isPlay));
  }

  const handleEnded = () => {
    dispatch(setIsPlay(false))
  }

  const handleInput = (e) => {
    const seekTime = audioRef.current.duration / 100 * e.target.value
    audioRef.current.currentTime = seekTime
    dispatch(setCurrentTime(seekTime))
  }

  const handleUpdateTime = () => {
    const progress = currentTime / audioRef.current.duration * 100
    inputRef.current.value = progress
    dispatch(setCurrentTime(audioRef.current.currentTime))
  }

  const handleLoadedData = () => {

  }
  return (
    <div className={`music ${pathname === '/lyric' ? 'lyric' : ''}`}>
        <div className="music__top">
            <input type="range" min="0" max="100" step="0.05" ref={inputRef} onChange={handleInput}/>
        </div>
        <div className="music__bottom">
          <div className="music__bottom__ava">
            <div className="music__bottom__ava__img">
              {
                avaSong ? <img src={avaSong} alt="avata" />
                : 
              <img srcSet={`${ava} 2x`} alt="avata" />
              }
            </div>
            <div className="music__bottom__ava__txt">
              {titleSong ? titleSong : 'Phát nhạc'}
            </div>
          </div>
          <div className="music__bottom__control">
            {
              isPlay && currentSong ? 
              <i class="fa-solid fa-pause" onClick={e => handlePausePlayClick(e)}></i> :
              <i class="fa-solid fa-play" onClick={e => handlePausePlayClick(e)}></i>
            }
            <audio 
              src={currentSong} ref={audioRef}
              onLoadedData={handleLoadedData}
              onTimeUpdate={handleUpdateTime}
              onEnded={handleEnded}
            ></audio>
          </div>
        </div>
    </div>
  )
}

export default Music