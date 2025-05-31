import React, { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { useParams } from 'react-router-dom'
import { UpdateUser } from '../../redux/apiRequest'
import InfoItem from './InfoItem'

const UserInfo = ({data}) => {
    const {username} = useParams()
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user.currentUser?.user.username)
    const accessToken = useSelector(state => state.user.currentUser?.accessToken)
    const edit = currentUser === username
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => {
        if(!data) return;
        setEmail(data.email)
        setName(data.name)
        setBio(data.bio)
    }, [data])

    const handleUpdateUser = async(param, type) => {
        await UpdateUser(data._id, type, param, accessToken, dispatch)
    }

  return (
    <div className="user__left__item">
        <div className="user__left__item__heading">
            Thông tin cá nhân
        </div>
        <div className="user__left__item__des">
            <InfoItem type="name" title="họ tên" param={name} handleUpdateUser={handleUpdateUser} setParam={setName} edit={edit}/>
            <InfoItem type="bio" title="bio" param={bio} handleUpdateUser={handleUpdateUser} setParam={setBio} edit={edit}/>
            {
                currentUser === username &&
                <>
                <InfoItem type="email" title="email" param={email} handleUpdateUser={handleUpdateUser} setParam={setEmail}/>
                </>
            }
        </div>
    </div>
  )
}

export default UserInfo