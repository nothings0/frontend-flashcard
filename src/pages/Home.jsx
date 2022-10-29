import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Search from '../components/Search'
import Helmet from '../components/Helmet';
import List from '../components/List'
import { GetHome } from '../redux/apiRequest'
import Skeleton from '../components/Skeleton';
import Footer from '../components/Footer';

const Home = () => {
    const dispatch = useDispatch()
    const { loading} = useSelector(state => state.middle)
    const [data, setData] = useState({})
    const userId = useSelector(state => state.user.currentUser?.user._id)
    useEffect(() => {
      const getData = async () => {
        try {
          const res = await GetHome(dispatch, 8, userId)
          const suggestList = res.suggestCards
          const recentCard = JSON.parse(localStorage.getItem("recent"))
          const dataList = {...res, recentCard: {data: recentCard, title: "Gần đây"}}
          setData(dataList)
          localStorage.setItem("suggestList", JSON.stringify(suggestList))
        } catch (err) {
        }
      }
      getData()
    }, [])

  return (
    <Helmet title='Trang chủ | Flux'>
    <div className="home">
      <Search/>
      <List title={data.populateCards?.title} data={data.populateCards?.data} type="trend"/>
      <List title={data.suggestCards?.title} data={data.suggestCards?.data} type="suggest"/>
      <List title={data.rateCards?.title} data={data.rateCards?.data} type="rate"/>
      <List title={data.cardSaveds?.title} data={data.cardSaveds?.data} type="saved"/>
      <List title={data.recentCard?.title} data={data.recentCard?.data} type="recent"/>
      {
        loading && <Skeleton type='feed'/>
      }
      <Footer/>
    </div>
    </Helmet>
  )
}

export default Home