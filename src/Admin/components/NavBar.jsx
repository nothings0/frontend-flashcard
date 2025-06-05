import {Link, useLocation} from 'react-router-dom'

const mainNav = [
    {
        display: "Tổng quan",
        path: "/admin",
        icon: "fa-solid fa-house"
    },
    {
        display: "Người dùng",
        path: "/admin/user",
        icon: "fa-solid fa-users"
    },
    {
        display: "Học phần",
        path: "/admin/flashcard",
        icon: "fa-solid fa-id-card"
    },
    {
        display: "Service",
        path: "/admin/service",
        icon: "fa-brands fa-servicestack"
    }
]

const NavBar = () => {

    const {pathname} = useLocation()
    const active = mainNav.findIndex(e => e.path === pathname)

  return (
    <div className="navbar">
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