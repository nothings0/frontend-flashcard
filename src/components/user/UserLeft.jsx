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
                <p>Bắt đầu học tập trên <b>Fluxquiz</b> từ <b>{day}</b></p>
                <p>Mã giới thiệu: <b>{data?.referralCode || "None"}</b></p>
            </div>
        </div>
        <UserInfo data={data}/>
    </div>
  )
}

export default UserLeft