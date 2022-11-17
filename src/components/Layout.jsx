import { UilAngleDown, UilBars, UilEstate, UilTruck } from '@iconscout/react-unicons'
import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { hidden } from '../features/navbar/navbarSlice'
import { Toaster } from 'react-hot-toast'
const Layout = ({ children }) => {

  return (
    <div className="layout">
      <Sidebar />
      <div className="page-content">{children}</div>
      <Header />
      <Toaster />
    </div>
  )
}

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showProfile, setShowProfile] = useState(false)

  // show profile detail
  const handleShowProfile = () => {
    setShowProfile(!showProfile)
  }

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <header className="header p-0">
      <div className="header header-container">
        <div className="header-left df-center">
          <div className="header-logo"></div>
          <button onClick={() => dispatch(hidden())} className="menu-icon df-center">
            <UilBars />
          </button>
        </div>
        <div className="header-main df-center">
          <div className="header-search df-center">
            <input type="search" placeholder="Search" />
            <button className="btn-outlined-primary">
              Search
            </button>
          </div>
          <div className="header-user">
            <div onClick={handleShowProfile} className="user-profile df-center">
              <div className="user-logo df-center">
                <p>R</p>
              </div>
              <UilAngleDown />
            </div>
            {showProfile && (
              <div className="user-detail">
                <small>Signed in as admin</small>
                <hr />
                <div onClick={handleLogout} className="user-logout">
                  <h5>Logout</h5>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

const Sidebar = () => {
  return (
    <aside className='sidebar'>
      <div className='sidebar-logo df-center'>
        <span />
      </div>
      <div className='sidebar-menu '>
        <NavLink to={'/dashboard'}>
          <div className='menu-dashboard df-center'>
            <UilEstate />
            <p>Dashboard</p>
          </div>
        </NavLink>
        <NavLink to={'/cars'}>
          <div className='menu-cars df-center'>
            <UilTruck />
            <p>Cars</p>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}

export default Layout
