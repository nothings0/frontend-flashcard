import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Helmet from '../components/Helmet'
import Search from '../components/Search'
import {GetLibrary} from '../redux/apiRequest'
import List from '../components/List'
import Skeleton from '../components/Skeleton'


const Library = () => {
  const accessToken = useSelector(state => state.user.currentUser?.accessToken)
  const { loading} = useSelector(state => state.middle)

  const [library, setLibrary] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    const GetLibraryA = async (accessToken) => {
      const suggestList = JSON.parse(localStorage.getItem("suggestList"))
      const res = await GetLibrary(accessToken, dispatch, 8)
      const data = {...res, suggestList}
      setLibrary(data)
    }
    GetLibraryA(accessToken)
  }, [])

  return (
    <Helmet title='Thư viện | Flux'>
    <div className="library">
      <Search/>
      <List title={library.library?.title} data={library.library?.cards} type="library"/>
      <List title={library.cardSaved?.title} data={library.cardSaved?.cards} type="saved"/>
      <List title="Gợi ý cho bạn" data={library.suggestList?.data} type="suggest"/>
      
      {
        loading && <Skeleton type='feed'/>
      }
    </div>
    </Helmet>
  )
}

export default Library