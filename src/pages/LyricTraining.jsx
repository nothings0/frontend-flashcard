import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Search from '../components/Search'
import { GetListTed } from '../redux/lyricApi'
import moment from 'moment-timezone'
import { useDispatch, useSelector } from 'react-redux'
import Skeleton from '../components/Skeleton'

const LyricTraining = () => {
    const { loading } = useSelector((state) => state.middle)
    const [listData, setListData] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        const listTraining = localStorage.getItem("listTraining")
        if(listTraining) {
            setListData(JSON.parse(listTraining))
            return
        }
        const getData = async() => {
            const res = await GetListTed(dispatch)
            setListData(res.topic.videos.nodes)
            localStorage.setItem("listTraining", JSON.stringify(res.topic.videos.nodes))
        }
        getData()
    }, [])

  return (
    <div className="lyric-training">
        <Search />
        {loading ? <Skeleton/> :
        <div className="lyric-training__container">
            {
                listData?.map((item, index) => (
                
                    <Link to={`${item.slug}`} className="lyric-training__item" key={index}>
                        <div className="lyric-training__item__img">
                            <img src={item.primaryImageSet[0].url} alt="ted-video"/>
                            <span>{moment.utc(item.duration*1000).format('mm:ss')}</span>
                        </div>
                        <div className="lyric-training__item__txt">
                            <div className="lyric-training__item__title">
                                {item.title}
                            </div>
                            <div className="lyric-training__item__time">
                                Posted {moment(item?.publishedAt).format('MMM YYYY')}
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
        }
    </div>
  )
}

export default LyricTraining