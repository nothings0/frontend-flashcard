import React, { memo, useRef, useEffect } from 'react'


const Modal = ({ modalOpen, setModalOpen, children }) => {
    const modalRef = useRef()
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setModalOpen(false)
            }
        }
        if(modalOpen){
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            }
        }
    }, [modalOpen]);

    return (
        <div className={`modal ${modalOpen ? 'active' : ''}`}>
        <div className="modal__container" ref={modalRef}>
            {children}
        </div>
    </div>
  )
}
export const ModalTitle = ({children, fnClose}) => {
    return (
        <div className="title">
            {children}
            <i className="fa-solid fa-xmark" onClick={fnClose ? () => fnClose() : null
            }></i>
        </div>
    )
}
export const ModalBody = ({children}) => {
    return (
        <div className="body">
            {children}
        </div>
    )
}
export const ModalFooter = ({children}) => {
    return (
        <div className="footer">
            {children}
        </div>
    )
}

export default memo(Modal)