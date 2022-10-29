import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SearchInput from '../components/SearchInput'
import NavBar from './NavBar'
import Dashboard from './Dashboard'
import SearchAva from '../components/SearchAva'
import { useSelector } from 'react-redux';
import CreateAdmin from './CreateAdmin'

const Admin = () => {

  const isAdmin = useSelector(state => state.user.currentUser?.user.isAdmin)

  return (
    <div className="admin">
      <NavBar/>
      <div className="admin__header">
        <SearchInput />
        <SearchAva />
      </div>
      <Routes>
        <Route path='/' element={isAdmin ? <Dashboard/> : <Navigate to="/login"/>}/>
        <Route path='/create' element={<CreateAdmin/>}/>
      </Routes>
    </div>
  )
}

export default Admin