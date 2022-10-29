import React from 'react'
import Card from '../Card'

const UserRight = ({data}) => {
  return (
    <div className="user__right">
      <div className="user__right__item">
        <div className="user__right__item__heading">
          Học phần đã tạo
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