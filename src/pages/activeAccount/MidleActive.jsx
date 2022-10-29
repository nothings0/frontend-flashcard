import React from 'react'
const logo = require("../../assets/Logo.png")

const MidleActive = () => {
  return (
    <div className="midle-active">
      <div className="midle-active__img">
        <img src={logo} alt="Logo" />
      </div>
      <div className="midle-active__heading">
        Vui lòng kiểm tra Email để hoàn tất đăng ký tài khoản
      </div>
      <div className="midle-active__des">
      Kiểm tra hộp thư đến của bạn và nhấp vào liên kết xác minh bên trong để hoàn tất đăng ký của bạn. Liên kết này sẽ hết hạn trong thời gian ngắn, vì vậy hãy xác minh sớm!
      </div>
      <div className="midle-active__footer">
        Nếu không thấy Email? <span>Hãy thử kiểm tra thư mục spam</span>
      </div>
    </div>
  )
}

export default MidleActive