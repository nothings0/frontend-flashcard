import React from 'react'
import {Link} from 'react-router-dom'
import Footer from '../../components/Footer'
import Helmet from '../../components/Helmet'

const PolicyPrivate = () => {
  return (
    <Helmet title="Chính sách bảo mật | Flux">
    <div className="policy">
      <div className="policy__header">Chính sách bảo mật</div>
      <div className="policy__description">
        <h4 className="policy__description__title">
          Thông tin cá nhân
        </h4>
        <p className="policy__description__text">
          <Link to="/" className='other-link'>Fluxquiz</Link> có thu nhập thông tin cá nhân của người dùng bao gồm: Họ tên, Email, Tên đăng nhập, Mật khẩu. Các thông tin trên bao gồm thông tin bắt buộc khi khai báo của người dùng khi đăng ký tài khoản. Trong phạm vi điều khoản, Fluxquiz đảm bảo và cam kết không sử dụng vào mục đích nào khác ngoài các điều khoản bên dưới.
        </p>
      </div>
      <div className="policy__description">
        <h4 className="policy__description__title">
          Sử dụng thông tin cá nhân
        </h4>
        <ul className="policy__description__text">
          <li className="policy__description__text__item">
            Cung cấp tiện ích tốt nhất cho người dùng.
          </li>
          <li className="policy__description__text__item">
            Liên hệ, xử lí các vấn đề của người dùng.
          </li>
          <li className="policy__description__text__item">
            Đảm bảo an toàn thông tin người dùng trong lúc sử dụng dịch vụ.
          </li>
          <li className="policy__description__text__item">
            Cung cấp thông tin, dịch vụ mới ra mắt cho người dùng.
          </li>
        </ul>
      </div>
      <div className="policy__description">
        <h4 className="policy__description__title">
          Mọi thắc mắc về bảo mật thông tín cá nhân, vui lòng liên hệ <span>sp.fluxquiz@gmail.com</span>.
        </h4>
      </div>
      <Footer/>
    </div>
    </Helmet>
  )
}

export default PolicyPrivate