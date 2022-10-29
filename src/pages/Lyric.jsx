import {useState, useEffect, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetPlayList, SearchSong } from '../redux/audioApi'
import Search from '../components/Search'
import Input from '../components/Input'
import Music from '../components/Music'
import useLyric from '../Hook/useLyric'
import Helmet from '../components/Helmet'
import Skeleton from '../components/Skeleton'


const Lyric = () => {

    const dispatch = useDispatch()

    const [search, setSearch] = useState('')
    const [activeSearch, setActiveSearch] = useState(false)
    const [currentValue, setCurrentValue] = useState('')
    const [dataSearch, setDataSearch] = useState([])
    const [index, setIndex] = useState('ZWZB96AB')
    const [list, setList] = useState([])
    const [indexSong, setIndexSong] = useState("")

    const currentTime = useSelector(state => state.audio.currentTime)
    const {loading} = useSelector(state => state.middle)
    const resultRef = useRef()
    const res = useLyric(indexSong)

    useEffect(() => {
        const listMusic = JSON.parse(localStorage.getItem("listMusic"))
        if(listMusic) {
            setList(listMusic)
            return;
        }
        const GetList = async() => {
            const res = await GetPlayList(index, dispatch)
            const data = res.song.items.filter((item) => {
                if(item.streamingStatus === 2 || item.hasLyric === false) return false
                else return true
            }).slice(0, 8)
            setList(data)
            localStorage.setItem("listMusic", JSON.stringify(data))
        }
        GetList()
    }, [])

    useEffect(() => {
        const getResult = async() => {
          if(currentValue){
            const res = await SearchSong(currentValue, dispatch)
            const data = res.songs.filter((item) => {
                if(item.streamingStatus === 2 || item.hasLyric === false) return false
                else return true
            }).slice(0, 5)
            setDataSearch(data)
          }
        }
        getResult()
    }, [currentValue])

    useEffect(() => {
        function handleClickOutside(event) {
          if (resultRef.current && !resultRef.current.contains(event.target)) {
            setActiveSearch(false)
          }
        }
        if(activeSearch){
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          }
        }
    }, [activeSearch])

    const getEl = (e) => {
        e?.focus()
    }

    const handleEnterSearch = () => {
        setCurrentValue(search)
        setActiveSearch(true)
    }

    const handleChangeInput = (e) => {
        setSearch(e.target.value)
        if(!e.target.value){
          setActiveSearch(false)
          setCurrentValue('')
        }
        if(!currentValue) setActiveSearch(false)
    }
  
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleEnterSearch()
        }
    }

    const handleFocus = () => {
        if(currentValue) setActiveSearch(true)
    }

    const handleIndexSong = (index) => {
        setActiveSearch(false)
        setIndexSong(index)
    }

  return ( 
    <Helmet title='Lyric training | Flux'>
    <div className="lyric">
        <Search />
        <div className="lyric__container">
            <div className="lyric__header">
                <div className="lyric__define__heading">
                    Lyric traning - Luyện nghe tiếng anh
                </div>
                <div className="lyric__define__search">
                    <input type="text" placeholder='Tìm kiếm bài hát..' onChange={handleChangeInput} onFocus={handleFocus} onKeyDown={handleEnter}/>
                    <i className="fa-solid fa-magnifying-glass search__icon" onClick={handleEnterSearch}></i>
                    {
                        loading ? <Skeleton/> : <>
                            {
                                activeSearch && 
                                <div className="lyric__result" ref={resultRef}>
                                    <ul className="lyric__result__list">
                                    {
                                    dataSearch?.map((item, idx) => (
                                        <li className='lyric__result__list__item' key={idx} onClick={() => handleIndexSong(item.encodeId)}>
                                            <div className="lyric__result__list__item__ava">
                                                <img src={item.thumbnail} alt="thumbnail" />
                                            </div>
                                            <div className="lyric__result__list__item__title">
                                            <h3>{item.title}</h3>
                                            <p>{item.artistsNames}</p>
                                            </div>
                                        </li>
                                    ))
                                    }
                                    </ul>
                                </div>
                            }
                        </> 
                    }
                </div>
            </div>
            {
                indexSong ? 
                <div className="lyric__wrap">
                    {
                        res ?
                        res.map((e, index) => {
                        if(e.startTime <= currentTime*1000 && currentTime*1000 <= e.endTime) {
                            let lineActive = document.getElementById(`line-${index}`)
                            lineActive?.scrollIntoView({ behavior: "smooth", block: "center" })
                            getEl(lineActive?.querySelector(".inputss"))
                        }
                        return (
                            <div
                            id={`line-${index}`}
                            key={index}
                            className={`lyric__line ${e.startTime <= currentTime*1000 && currentTime*1000 <= e.endTime ? 'active' : ''}`}
                            // onDoubleClick={() => setCurrentTime(e.startTime/1000)}
                            >
                            {
                                e.data.map((item, index) => {
                                    if(item === ''){
                                        return (
                                            <Input length={e.answer.answerLength} key={index} correct={e.answer.correct} endTime={e.endTime}/>
                                        )
                                    }else{
                                        return (
                                            <span key={index}>{item} </span>
                                        )
                                    }
                                })
                            }
                            </div>
                        )
                        }) : <h2>Không hỗ trợ lyric training</h2>
                    }
                </div> : 
                <div className="lyric__define">
                    {
                        loading ? <Skeleton/> : 
                        <div className="lyric__define__data">
                            {
                                list?.map((item, index) => (
                                    <div className="list__item" key={index} onClick={() => handleIndexSong(item.encodeId)}>
                                        <div className="list__item__img">
                                            <img src={item.thumbnail} alt="thumbnail" />
                                        </div>
                                        <div className="list__item__txt">
                                            <div className="list__item__txt__title">
                                                {item.title}
                                            </div>
                                            <div className="list__item__txt__artist">
                                                {item.artistsNames}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>
            }
        </div>
        <Music indexSong={indexSong}/>
    </div>
    </Helmet>
  )
}

export default Lyric