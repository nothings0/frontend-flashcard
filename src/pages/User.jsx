import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import Search from '../components/Search'
import Header from '../components/Header'
import Helmet from '../components/Helmet'
import { GetUser } from '../redux/apiRequest'
import UserTop from '../components/user/UserTop'
import UserLeft from '../components/user/UserLeft'
import UserRight from '../components/user/UserRight'
import { useParams } from 'react-router-dom'
import Skeleton from '../components/Skeleton'

const User = () => {
  const {username} = useParams()
  const [data, setData] = useState([])
  const { loading } = useSelector((state) => state.middle)

  useEffect(() => {
    const getData = async () => {
      const res = await GetUser(username)
      setData(res)
    }
    getData()
  }, [username])
  

  return (
    <Helmet title={`${data?.user?.name || username || 'Loading'} | Flux`}>
    <div className="user">
      <Search />
      <Header />
      {
        loading ? <Skeleton type='loading'/> : <>
          <UserTop data={data?.user}/>
          <div className="user__content">
            <UserLeft data={data?.user} data2={data?.achieve}/>
            <UserRight data={data?.cards}/>
          </div>
        </>
      }
    </div>
    </Helmet>
  )
}

export default User