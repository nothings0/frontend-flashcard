import React from 'react'
import { Link, useLocation } from 'react-router-dom'
const mainNav = [
    {
        display: "Giới thiệu",
        path: "/info"
    },
    {
        display: "Liên hệ",
        path: "/info/lien-he"
    },
    {
        display: "Điều khoản dịch vụ",
        path: "/info/terms-of-service"
    },
    {
        display: "Chính sách bảo mật",
        path: "/info/privacy-policy"
    }
]

const Header = () => {
    const { pathname } = useLocation()
    // let pathName = pathname.split('/')[2]
  const activeNav = mainNav.findIndex(e => e.path === pathname)
  return (
    <div className="header-other">
        <div className="header-other__link">
        {
            mainNav.map((item, index) => (
                <div className={`header-other__link__item ${index === activeNav ? 'active' : ''}`} key={index}>
                  <Link to={item.path}>
                    {item.display}
                  </Link>
                </div>
            ))
        }
        </div>
    </div>
  )
}

export default Header