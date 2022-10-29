import React, { useRef, useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import { SearchCard } from '../redux/apiRequest';
const ava = require("../assets/ava1.png")

const SearchInput = () => {

    const [search, setSearch] = useState('')
    const [activeSearch, setActiveSearch] = useState(false)
    const [currentValue, setCurrentValue] = useState('')
    const [dataSearch, setDataSearch] = useState([])
    
    const resultRef = useRef()
   
    const handleEnterSearch = () => {
      setCurrentValue(search)
      setActiveSearch(true)
    }

    useEffect(() => {
      function handleClickOutside(event) {
        if (resultRef.current && !resultRef.current.contains(event.target)) {
          setActiveSearch(false)
        }
      }
      if(activeSearch){
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        }
      }
    }, [activeSearch])
    
    useEffect(() => {
      const getResult = async() => {
        if(currentValue){
          const res = await SearchCard(currentValue)
          setDataSearch(res)
        }
      }
      getResult()
    }, [currentValue])

    const handleChangeInput = (e) => {
      setSearch(e.target.value)
      if(!e.target.value){
        setActiveSearch(false)
        setCurrentValue('')
      }
      if(!currentValue) setActiveSearch(false)
    }

    const handleEnter = (e) => {
      if (e.key === 'Enter' && search) {
        handleEnterSearch()
      }
    }
    const handleFocus = () => {
      if(currentValue) setActiveSearch(true)
    }
    
  return (
    <div className="searching__input">
      <div className="searching__input__search">
      <input type="text" placeholder='Tìm kiếm ...' onChange={handleChangeInput} onFocus={handleFocus} onKeyDown={handleEnter}/>
      <i className="fa-solid fa-magnifying-glass search__icon" onClick={handleEnterSearch}></i>
      </div>
      {
      activeSearch && 
      <div className="searching__input__result" ref={resultRef}>
        <ul className="searching__input__result__list">
        {
          dataSearch?.map((item, idx) => (
            <li className='searching__input__result__list__li' key={idx}>
              <h2 className="searching__input__result__list__title">
                {item.title}
              </h2>
              {
                item.data.length > 0 ?
                <>
                {
                  item.data.map((i, index) => {
                    if(item.title === 'Khóa học')
                      return (
                        <Link to={`/card/${i._id}`} key={index}>
                          <div className="searching__input__result__list__item">
                            <div className="searching__input__result__list__item__img">
                              <div className="searching__input__result__list__item__img__img" style={{background: `${i.background}`}}></div>
                            </div>
                            <p className="searching__input__result__list__item__title">
                              {i.title}
                            </p>
                          </div>
                        </Link>
                      )
                    else if(item.title === 'Người dùng')
                    return (
                      <Link to={`/user/${i.username}`} key={index}>
                        <div className="searching__input__result__list__item">
                          <div className="searching__input__result__list__item__img">
                            <img src={i.profilePic || ava} alt="avatar" />
                          </div>
                          <p className="searching__input__result__list__item__title">
                            {i.username}
                          </p>
                        </div>
                      </Link>
                    )
                  })
                }
                </> : <p className="searching__input__result__list__des">Không có kết quả tìm kiếm <span>{item.title}</span> cho <span>{currentValue}</span></p>
              }
            </li> 
          ))
        }
        </ul>
      </div>
      }
    </div>
  )
}

export default SearchInput