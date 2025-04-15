import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { SearchCard } from '../redux/apiRequest';
import debounce from 'lodash/debounce';

const ava = require('../assets/ava1.png');

const SearchInput = () => {
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState(false);
  const [currentValue, setCurrentValue] = useState('');
  const [dataSearch, setDataSearch] = useState([]);
  const resultRef = useRef();

  // Fetch kết quả từ server
  const fetchResults = async (value) => {
    if (value) {
      const res = await SearchCard(value);
      setDataSearch(res || []);
      setActiveSearch(true);
    }
  };

  // Dùng debounce để tránh gọi API liên tục
  const debouncedSearch = useCallback(
    debounce((value) => {
      setCurrentValue(value);
    }, 500),
    []
  );

  // Xử lý khi input thay đổi
  const handleChangeInput = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value) {
      setActiveSearch(false);
      setCurrentValue('');
    } else {
      debouncedSearch(value);
    }
  };

  // Tự động gọi API mỗi khi currentValue thay đổi
  useEffect(() => {
    if (currentValue) {
      fetchResults(currentValue);
    }
  }, [currentValue]);

  // Click ngoài dropdown để đóng
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (resultRef.current && !resultRef.current.contains(e.target)) {
        setActiveSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Nhấn Enter để tìm kiếm
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && search) {
      debouncedSearch.cancel(); // huỷ debounce và gọi ngay lập tức
      setCurrentValue(search);
    }
  };

  return (
    <div className="searching__input">
      <div className="searching__input__search">
        <input
          type="text"
          placeholder="Tìm kiếm ..."
          value={search}
          onChange={handleChangeInput}
          onFocus={() => currentValue && setActiveSearch(true)}
          onKeyDown={handleKeyDown}
        />
        <i
          className="fa-solid fa-magnifying-glass search__icon"
          onClick={() => {
            debouncedSearch.cancel();
            setCurrentValue(search);
          }}
        ></i>
      </div>

      {activeSearch && (
        <div className="searching__input__result" ref={resultRef}>
          <ul className="searching__input__result__list">
            {dataSearch?.map((section, idx) => (
              <li key={idx} className="searching__input__result__list__li">
                <h2 className="searching__input__result__list__title">
                  {section.title}
                </h2>
                {section.data.length > 0 ? (
                  section.data.map((item, index) => {
                    if (section.title === 'Khóa học') {
                      return (
                        <Link to={`/card/${item.slug}`} key={index}>
                          <div className="searching__input__result__list__item">
                            <div className="searching__input__result__list__item__img">
                              <div
                                className="searching__input__result__list__item__img__img"
                                style={{ background: `${item.background}` }}
                              ></div>
                            </div>
                            <p className="searching__input__result__list__item__title">
                              {item.title}
                            </p>
                          </div>
                        </Link>
                      );
                    } else if (section.title === 'Người dùng') {
                      return (
                        <Link to={`/user/${item.username}`} key={index}>
                          <div className="searching__input__result__list__item">
                            <div className="searching__input__result__list__item__img">
                              <img src={item.profilePic || ava} alt="avatar" />
                            </div>
                            <p className="searching__input__result__list__item__title">
                              {item.username}
                            </p>
                          </div>
                        </Link>
                      );
                    }
                    return null;
                  })
                ) : (
                  <p className="searching__input__result__list__des">
                    Không có kết quả tìm kiếm <span>{section.title}</span> cho{' '}
                    <span>{currentValue}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
