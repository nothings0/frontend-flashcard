import React from 'react'
import Footer from '../../components/Footer'
import {Link} from 'react-router-dom'
import Helmet from '../../components/Helmet'
import logo from "../../assets/Lo-go.png"

const Info = () => {
  return (
    <Helmet title="Giới thiệu | Flux">
    <div className="info">
      <div className="info__header">Giới thiệu</div>
      <div className="info__img">
        <img src={logo} alt="Logo FLuxquiz" />
      </div>
      <div className="info__description">
        <p className="info__description__text">
          Tháng 10/2022, <Link to="/" className='other-link'>Fluxquiz</Link> ra đời để phục vụ việc ghi nhớ trong việc dạy học và học tập trở nên đơn giản hơn.
        </p>
        <p className="info__description__text">
          Fluxquiz cung cấp công cụ học tập giúp bạn ghi nhớ nhanh chóng bất cứ nội dung gì. Kết hợp nhiều phương pháp học tập và ghi nhớ, <span>Fluxquiz</span> tạo ra bộ công cụ thẻ ghi nhớ với nhiều điểm cải tiến giúp việc ghi nhớ trở nên đơn giản.
        </p>
        <p className="info__description__text">
          Với mong muốn giúp ích cho cộng đồng học tập, Fluxquiz hi vọng sản phẩm sẽ được cộng đồng ủng hộ.
        </p>
      </div>
      <Footer/>
    </div>
    </Helmet>
  )
}

export default Info