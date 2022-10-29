import React, { useEffect, useState } from 'react'
import moment from 'moment-timezone'
import UserInfo from './UserInfo'

const UserLeft = ({data, data2}) => {
    const [day, setDay] = useState('')
    // console.log(data);
    useEffect(() => {
        const date = moment(data?.createdAt).format('DD-MM-YYYY')
        setDay(date)
    }, [data])

    const handleLevel = (data) => {
        if(data < 10) return "lv1"
        else if(data >= 10 && data < 50) return "lv2"
        else if(data >= 50 && data < 100) return "lv3"
        else return "lv4"
    }
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
        <div className="user__left__item">
            <div className="user__left__item__heading">
                Thống kê
            </div>
            {
                data2 ?
                <div className="user__left__item__des">
                    <div className="user__left__item__des__achieve">
                        <h4>Đã học <span>{data2.achieveLearn}</span> từ</h4>
                        <i title={`${handleLevel(data2.achieveTest)}`} className={`fa-solid fa-gem ${handleLevel(data2.achieveLearn)}`}></i>
                    </div>
                    <div className="user__left__item__des__achieve">
                        <h4>Đã nghe <span>{data2.achieveListen}</span> từ</h4>
                        <i title={`${handleLevel(data2.achieveTest)}`} className={`fa-solid fa-gem ${handleLevel(data2.achieveListen)}`}></i>
                    </div>
                    <div className="user__left__item__des__achieve">
                        <h4>Đã viết <span>{data2.achieveWrite}</span> từ</h4>
                        <i title={`${handleLevel(data2.achieveTest)}`} className={`fa-solid fa-gem ${handleLevel(data2.achieveWrite)}`}></i>
                    </div>
                    <div className="user__left__item__des__achieve">
                        <h4>Đã thành thạo <span>{data2.achieveTest}</span> từ</h4>
                        <i title={`${handleLevel(data2.achieveTest)}`} className={`fa-solid fa-gem ${handleLevel(data2.achieveTest)}`}></i>
                    </div>
                </div> : 
                <p>Chưa có thống kê nào, bắt đầu học tập ngay!</p>
            }
        </div>
    </div>
  )
}

export default UserLeft