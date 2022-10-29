import React from 'react'
import {Link} from 'react-router-dom'
import Footer from '../../components/Footer'
import Helmet from '../../components/Helmet'

const TermsOfService = () => {
  return (
    <Helmet title="Điều khoản dịch vụ | Flux">
    <div className="terms">
      <div className="terms__header">Điều khoản sử dụng</div>
      <div className="terms__description">
        <h4 className="terms__description__title">
          Nguyên tắc chung
        </h4>
        <p className="terms__description__text">
          <Link to="/" className='other-link'>Fluxquiz</Link> thành lập và vận hành hợp pháp. Người dùng sử dụng dịch vụ trên fluxquiz vui lòng không vi phạm qui định trong điều khoản.
        </p>
      </div>
      <div className="terms__description">
        <h4 className="terms__description__title">
          Điều khoản
        </h4>
        <ul className="terms__description__text">
          <li className="terms__description__text__item">
            Tuân thủ các chính sách và điều khoản trong khi sử dụng dịch vụ trên fluxquiz.
          </li>
          <li className="terms__description__text__item">
            Không spam, reload lại nhiều lần.
          </li>
          <li className="terms__description__text__item">
            Không copy, sử dụng trái phép dữ liệu của người dùng khác.
          </li>
        </ul>
      </div>
      <div className="terms__description">
        <h4 className="terms__description__title">
          Mọi thắc mắc về bảo mật thông tín cá nhân, vui lòng liên hệ <span>sp.fluxquiz@gmail.com</span>.
        </h4>
      </div>
      <Footer/>
    </div>
    </Helmet>
  )
}

export default TermsOfService