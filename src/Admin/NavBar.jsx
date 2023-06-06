import React from 'react'
import {Link, useLocation} from 'react-router-dom'

const logo = require("../assets/Logo.png")
const mainNav = [
    {
        display: "Dashboard",
        path: "/admin",
        icon: "fa-solid fa-house"
    },
    {
        display: "Service",
        path: "/admin/service",
        icon: "fa-brands fa-servicestack"
    },
    {
        display: "Tạo",
        path: "/admin/create",
        icon: "fa-solid fa-plus"
    },
    {
        display: "Sign Out",
        path: "/signout",
        icon: "fa-solid fa-arrow-right-from-bracket"
    }
]

const NavBar = () => {

    const {pathname} = useLocation()
    const active = mainNav.findIndex(e => e.path === pathname)

  return (
    <div className="navbar">
        <div className="navbar__logo">
            <Link to="/">
                <img src={logo} alt="Logo" />
            </Link>
        </div>
        <div className="navbar__link">
            {
                mainNav?.map((item, index) => (
                    <div className={`navbar__link__item ${index === active ? 'active' : ''}`} key={index}>
                        <Link to={item.path}>
                            <i className={item.icon}></i>
                            {item.display}
                        </Link>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default NavBar