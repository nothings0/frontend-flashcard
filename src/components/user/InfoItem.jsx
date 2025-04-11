import React, { useState } from 'react'

const InfoItem = ({ title, handleUpdateUser, param, setParam, type, edit }) => {

    const [active, setActive] = useState(false)

    return (
        <div className="user__left__item__des__item">
            <div className="user__left__item__des__item__heading">
                <span>{title}</span>
                {
                    edit &&
                    <>
                        {
                            active ?
                                <div className="user__left__item__des__item__heading__btn">
                                    <span onClick={() => {
                                        handleUpdateUser(param, type)
                                        setActive(false)
                                    }
                                    }>
                                        <i className="fa-solid fa-check save"></i>
                                    </span>
                                    <span onClick={() => setActive(false)}>
                                        <i className="fa-solid fa-xmark cancel"></i>
                                    </span>
                                </div>
                                :
                                <div className="user__left__item__des__item__heading__edit" onClick={() => setActive(true)}>
                                    <i className="fa-solid fa-pen-to-square edit"></i>
                                </div>
                        }
                    </>
                }
            </div>
            <input className="user__left__item__des__item__input" value={param} onChange={(e) => setParam(e.target.value)} placeholder={`${edit && param ? `Nhập ${title} của bạn` : `${type === 'password' ? "********" : 'Không có thông tin'}`}`} disabled={!active} type={`${type === 'password' ? 'password' : 'text'}`} />
        </div>
    )
}

export default InfoItem