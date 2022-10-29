import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { UpdateProfilePic } from '../../redux/apiRequest'
const ava = require("../../assets/ava1.png")

const UserTop = ({data}) => {
    const [avatar, setAvatar] = useState('')
    const accessToken = useSelector(state => state.user.currentUser?.accessToken)
    const dispatch = useDispatch()
    useEffect(() => {
        return () => {
            avatar && URL.revokeObjectURL(avatar.preview)
        }
    }, [avatar])
    
    const updateProfilePic = () => {
        let formData = new FormData()
        formData.append("file", avatar)
        UpdateProfilePic(formData, dispatch, accessToken)
    }

    const handleChangeAva = (e) => {
        const file = e.target.files[0]
        file.preview = URL.createObjectURL(file)
        setAvatar(file)
    }
  return (
    <div className="user__top">
        <div className="user__top__background">
            {
                data?.bio ? <h3>{data.bio}</h3> : <h3>Học tập không giới hạn tại Fluxquiz.com</h3>
            }
        </div>
        <div className="user__top__info">
            <div className="user__top__info__ava">
                <i className="fa-solid fa-camera"></i>
                <input type="file" onChange={handleChangeAva}/>
                <img src={avatar ? avatar.preview : (data?.profilePic ? data?.profilePic : ava)} alt="avatar" />
            </div>
            <div className="user__top__info__name">
                <span>{data?.name.length > 0 ? data?.name : data?.username}</span>
            </div>
        </div>
        {
            avatar && <div className="user__top__btn">
                        <span onClick={updateProfilePic}>Lưu</span>
                    </div>
        }
    </div>
  )
}

export default UserTop