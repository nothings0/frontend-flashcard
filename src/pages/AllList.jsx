import {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetListCard } from '../redux/apiRequest'
import Search from '../components/Search'
import Helmet from '../components/Helmet'
import { useLocation, useParams } from 'react-router-dom'
import Card from '../components/Card'
import Skeleton from '../components/Skeleton'
import Footer from '../components/Footer'


const AllList = () => {
  const [data, setData] = useState([])
  const [cards, setCards] = useState([])
  const [page, setPage] = useState(1)
  const {type} = useParams()
  const dispatch = useDispatch()
  const { loading} = useSelector(state => state.middle)
  const userId = useSelector(state => state.user.currentUser?.user._id)
  useEffect(() => {
    const getData = async() => {
      try {
        const res = await GetListCard(dispatch, type, page, 12, userId)
        setData(res)
        setCards([...cards, ...res.cards])
      } catch (err) {
      }
    }
    getData()
  }, [page])

  const handleLoadMore = () => {
    setPage(page + 1)
  }

  return (
    <Helmet title={`${data?.title} | Flux` || 'Loading'}>
    <div className="all-list">
      <Search/>
      <div className="all-list__heading">
        <h3 className="all-list__heading__title">{data?.title}</h3>
      </div>
      <div className="all-list__container">
        {
          loading ? <Skeleton type='loading'/> :
          cards?.map((item, index) => (
            <Card data={item} key={index}/>
          ))
        }
      </div>
      {
        data?.total > page && <div className="load-more">
        <span onClick={handleLoadMore}>Xem thêm</span>
      </div>
      }
    <Footer/>
    </div>
    </Helmet>
  )
}

export default AllList