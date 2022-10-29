import {useState} from 'react'
import { useSelector } from 'react-redux'
import { createCardAdmin } from '../redux/apiRequest'

const colors = [
  {
      hex: "flux1",
      css: 'linear-gradient(45deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)'
  },
  {
      hex: "flux2",
      css: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)'
  },
  {
      hex: "flux3",
      css: 'linear-gradient(45deg, rgba(253,227,26,1) 0%, rgba(254,139,37,1) 100%)'
  },
  {
      hex: "flux4",
      css: 'linear-gradient(135deg, rgba(154,4,129,1) 0%, rgba(220,61,99,1) 50%, rgba(254,115,23,1) 100%)'
  },
  {
      hex: "flux5",
      css: 'linear-gradient(45deg, rgba(100,38,151,0.9) 0%, rgba(152,45,151,1) 50%, rgba(190,52,117,0.9) 100%)'
  },
  {
      hex: "flux6",
      css: 'linear-gradient(45deg, rgba(38,49,151,1) 0%, rgba(39,22,96,1) 50%, rgba(147,52,190,1) 100%)'
  },
]

const CreateAdmin = () => {
  const [title, setTitle] = useState('')
  const [des, setDes] = useState('')
  const [json, setJson] = useState('')
  const [background, setBackground] = useState('')
  
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  )

  const create = () => {
    const data = {
      title,
      des,
      json,
      background
    }
    createCardAdmin(accessToken, data)
  }

  return (
    <div className="create-admin">
      <p>Title</p>
      <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='title ...'/>
      <p>Description</p>
      <input onChange={(e) => setDes(e.target.value)} value={des} type="text" placeholder='desciption ...'/>
      <p>JSON</p>
      <textarea onChange={(e) => setJson(e.target.value)} value={json} type="text" placeholder='json ...' rows={10} style={{height: 'unset'}}/>
      <div className="edit__header__right__item__color">
                    {
                        colors.map((item, index) => {
                            const style = {
                                background: `${item.css}`
                            }
                            return (
                                <div className={`edit__header__right__item__color__item ${item.css === background ? 'active' : ''}`} key={index} style={style} onClick={() => setBackground(item.css)}></div>
                            )
                        })
                    }
                </div>
      <button onClick={create}>Tạo</button>
    </div>
  )
}

export default CreateAdmin