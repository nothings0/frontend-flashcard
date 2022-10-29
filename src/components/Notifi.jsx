import React, { useRef, useState, useEffect } from 'react';
import { GetNotifi, ReadNotifi } from '../redux/apiRequest';
import moment from 'moment-timezone'
import { useSelector } from 'react-redux';
const logo = require("../assets/Logo.png")

const Notifi = () => {
    const [isNotifiActive, setIsNotifiActive] = useState(false)
    const [notifis, setNotifis] = useState([])
    const notifiRef = useRef()
    const accessToken = useSelector(state => state.user.currentUser?.accessToken)

    useEffect(() => {
        const getNotifi = async () => {
          const res = await GetNotifi(accessToken)
          setNotifis(res)
        }
        getNotifi()
    }, [])
    useEffect(() => {
        function handleClickOutside(event) {
          if (notifiRef.current && !notifiRef.current.contains(event.target)) {
            setIsNotifiActive(false)
          }
        }
        if(isNotifiActive){
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          }
        }
    }, [isNotifiActive])
    const ReadedNotifi = async(notifiId, isRead, position) => {
        if(!isRead){
          const res = await ReadNotifi(notifiId, accessToken)
          let newNotifi = [...notifis]
          newNotifi.splice(position, 1, res)
          setNotifis(newNotifi)
        }
    }
    const handleNotifiActive = () => {
        setIsNotifiActive(!isNotifiActive)
    }
    
  return (
    <div className="searching__ava__notifi" ref={notifiRef} onClick={handleNotifiActive}>
        <i className="fa-solid fa-bell"></i>
        <div className={`searching__ava__list lg ${isNotifiActive ? 'active' : ''}`} ref={notifiRef}>
        <div className="searching__ava__list__heading">
            Thông báo
        </div>
        {
            notifis?.map((item, index) => (
            <div className={`searching__ava__notifi__wrap ${item?.isRead ? 'read' : ''}`} onClick={() => ReadedNotifi(item._id, item.isRead, index)} key={item?._id}>
                <div className="searching__ava__notifi__img">
                <img src={logo} alt="Logo FLuxquiz" />
                </div>
                <div className="searching__ava__notifi__content">
                <p>{item.content}</p>
                <span>{moment(item.createdAt, "YYYYMMDD").fromNow()}</span>
                </div>
            </div>
            ))
        }
        </div>
    </div>
  )
}

export default Notifi