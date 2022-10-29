import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Card from './Card'
import User from './User'
import {GetAllUser, getAllCard} from '../redux/apiRequest.js'

const Dashboard = () => {

  const [users, setUsers] = useState([])
  const [cards, setCards] = useState([])

  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  )
  // const dispatch = useDispatch()

  useEffect(() => {
    const getData = async () => {
      const res = await getAllCard(accessToken)
      setCards(res)
      const res1 = await GetAllUser(accessToken)
      setUsers(res1)
    }
    getData()
  }, [])

  return (
    <div className="dashboard">
      <User data={users}/>
      <Card data={cards}/>
    </div>
  )
}

export default Dashboard