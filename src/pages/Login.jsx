import React, { useState, useEffect } from "react";
import Search from "../components/Search";
import Helmet from "../components/Helmet";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ForgotPassword from "./forgotPassword/ForgotPassword";
import Skeleton from "../components/Skeleton";
import { LoginUser } from "../redux/apiRequest";
import SocialLogin from "../components/SocialLogin";

const Auth = () => {
  const { loading } = useSelector((state) => state.middle);
  const username = useSelector(
    (state) => state.user.currentUser?.user.username
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [eyeActive, setEyeActive] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      const newUser = {
        username: values.username,
        password: values.password,
      };
      const res = await LoginUser(newUser, dispatch);
      if (res?.code === 400) {
        setErrorMsg(res.msg);
      }
      const isAdmin = res.user.isAdmin;
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    },
  });

  useEffect(() => {
    if (username) {
      navigate("/");
    }
  }, []);

  return (
    <Helmet title="Đăng nhập | Flux">
      <div className="login">
        <Search />
        {!username && (
          <>
            {!forgot ? (
              <form className="form" onSubmit={handleSubmit}>
                <h3>Đăng nhập</h3>
                <SocialLogin />
                <input
                  type="text"
                  name="username"
                  placeholder="Nhập tên đăng nhập"
                  className="box"
                  value={values.username}
                  onChange={handleChange}
                />
                <div className="form__input">
                  <input
                    type={eyeActive ? "text" : "password"}
                    name="password"
                    placeholder="Nhập mật khẩu"
                    className="box"
                    value={values.password}
                    onChange={handleChange}
                  />
                  {eyeActive ? (
                    <i
                      className="fa-solid fa-eye-slash"
                      onClick={() => setEyeActive(!eyeActive)}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-eye"
                      onClick={() => setEyeActive(!eyeActive)}
                    ></i>
                  )}
                </div>
                {errorMsg && <p className="login__notifi">{errorMsg}</p>}
                <h4 onClick={() => setForgot(true)}>Quên mật khẩu ?</h4>
                <button type="submit">Đăng nhập</button>
                <p className="login__footer">
                  Bạn chưa có tài khoản?<Link to="/register">Đăng ký ngay</Link>
                </p>
              </form>
            ) : (
              <ForgotPassword setForgot={setForgot} />
            )}
          </>
        )}
        {loading && <Skeleton />}
      </div>
    </Helmet>
  );
};

export default Auth;
