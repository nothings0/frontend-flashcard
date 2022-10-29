import React from 'react'
import { Route, Routes } from 'react-router-dom'

import User from '../pages/User';
import ActiveAccount from '../pages/activeAccount/ActiveAccount';
import MidleActive from '../pages/activeAccount/MidleActive';
import MiddleForgot from '../pages/forgotPassword/MiddleForgot';

const UserRoute = () => {
  return (
    <>
        <Routes>
            <Route path='/:username' element={<User/>}/>
            <Route path='/active' element={<MidleActive/>}/>
            <Route path='/reset-password/:slug' element={<MiddleForgot/>}/>
            <Route path='/active/:slug' element={<ActiveAccount/>}/>
        </Routes>
    </>
  )
}

export default UserRoute