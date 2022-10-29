import {useEffect, useState, useRef} from 'react'

const Wrap = ({children}) => {
    const ref = useRef()
    const [active, setActive] = useState(false)
    
    const handleActive = () => {
        setActive(!active)
    }

    useEffect(() => {
        function handleClickOutside(event) {
          if (ref?.current && !ref.current.contains(event.target)) {
            setActive(false)
          }
        }
        if(active){
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          }
        }
    }, [active])
  return (
    <div className="wrap" onClick={handleActive} ref={ref}>
        {children}
    </div>
  )
}

export default Wrap