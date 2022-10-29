import React from 'react'
import { LoginFacebook, LoginGoogle } from '../redux/apiRequest'
import { GoogleLogin} from '@react-oauth/google'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FacebookLogin from 'react-facebook-login'


const SocialLogin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onGoogleSignIn = (user) => {
        LoginGoogle(user.credential, dispatch, navigate)
    }
    const responseFacebook = (res) => {
      const {accessToken, userID} = res
      LoginFacebook(accessToken, userID, dispatch, navigate)
    }
  return (
    <div className="social-login">
        <GoogleLogin
            onSuccess={(user) => onGoogleSignIn(user)}
            type="icon"
            theme="filled_blue"
        />
        <FacebookLogin
          appId="5511597725613944"
          autoLoad={true}
          fields="name,email,picture"
          callback={responseFacebook}
          textButton=''
          icon="fa-brands fa-facebook"
          size='small'
        />
    </div>
  )
}

export default SocialLogin