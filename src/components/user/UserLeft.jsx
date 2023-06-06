import React, { useEffect, useState } from 'react'
import moment from 'moment-timezone'
import UserInfo from './UserInfo'

const UserLeft = ({data}) => {
    const [day, setDay] = useState('')
    useEffect(() => {
        const date = moment(data?.createdAt).format('DD-MM-YYYY')
        setDay(date)
    }, [data])

  return (
    <div className="user__left">
        <div className="user__left__item">
            <div className="user__left__item__heading">
                Giới thiệu
            </div>
            <div className="user__left__item__des">
                <span>Bắt đầu học tập trên <span>Fluxquiz.com</span> từ {day}</span>
            </div>
        </div>
        <UserInfo data={data}/>
    </div>
  )
}

export default UserLeft