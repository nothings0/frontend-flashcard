import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import FlipCard from '../components/FlipCard'
import Helmet from '../components/Helmet';
import { GetFlashCard } from '../redux/apiRequest'
import Skeleton from '../components/Skeleton'
import HeaderPrimary from '../components/HeaderPrimary'

const FlashCard = () => {
  const [progess, setProgess] = useState(0)
  const [data, setData] = useState([])
  const dispatch = useDispatch()

  const {cardId} = useParams()
  const {loading} = useSelector(state => state.middle)

  useEffect(() => {
    const getData = async () => {
      const res = await GetFlashCard(dispatch, cardId)
      setData(res)
    }
    getData()
  }, [cardId])

  return (
    <Helmet title="Thẻ ghi nhớ | Flux">
    <div className="flash-card">
      <HeaderPrimary value={progess} length={data?.terms?.length} title="Thẻ ghi nhớ"/>
      <div className="flash-card__flip">
        <FlipCard data={data?.terms} setProgess={setProgess} isVolume={true}/>
      </div>
      {loading && <Skeleton />}
    </div>
    </Helmet>
  )
}

export default FlashCard