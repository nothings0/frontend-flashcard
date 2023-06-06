import React from 'react'
import Card from '../Card'

const UserRight = ({data}) => {
  
  return (
    <div className="user__right">
      <div className="user__right__item">
        <div className="user__right__item__heading">
          <p>Học phần đã tạo</p> <span>Xem thêm</span>
        </div>
        {
          data?.length > 0 ? 
          <div className="user__right__item__des">
            {
              data.map((item, index) => (
                <Card flex={true} key={index} data={item}/>
              ))
            }
          </div> : <p>Bạn chưa tạo học phần nào</p>
        }
      </div>
    </div>
  )
}

export default UserRight