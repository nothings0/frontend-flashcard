import React from 'react'
import {Link} from 'react-router-dom'
import Search from '../components/Search'

const NotFound = () => {
  return (
    <div className="not-found">
      <Search />
      <div className="not-found__container">
        <h2>404</h2>
        <h3>Đường dẫn này không hoạt động</h3>
        <Link to="/">
        <i class="fa-solid fa-angle-left"></i>
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  )
}

export default NotFound