import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Info from '../pages/OtherPage/Info';
import PolicyPrivate from '../pages/OtherPage/PolicyPrivate';
import Contact from '../pages/OtherPage/Contact';
import TermsOfService from '../pages/OtherPage/TermsOfService';
import Header from '../pages/OtherPage/Header';

const OtherRoute = () => {
  return (
    <div className="other-page">
      <div className="other-page__wrap">
      <Header />
      <div className="other-page__main">
      <Routes>
          <Route path='/' element={<Info/>}/>
          <Route path='/lien-he' element={<Contact/>}/>
          <Route path='/terms-of-service' element={<TermsOfService/>}/>
          <Route path='/privacy-policy' element={<PolicyPrivate/>}/>
      </Routes>
      </div>
      </div>
    </div>
  )
}

export default OtherRoute