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

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Vui lòng nhập tên đăng nhập"),
      password: Yup.string()
        .min(6, "Mật khẩu tối thiểu 6 ký tự")
        .required("Vui lòng nhập mật khẩu"),
    }),
    onSubmit: async (values) => {
      const res = await LoginUser(values, dispatch);
      if (res?.code === 400) {
        setErrorMsg(res.msg);
        return;
      }
      const isAdmin = res.user?.isAdmin;
      if (isAdmin) navigate("/admin");
      else navigate("/");
    },
  });

  useEffect(() => {
    if (username) {
      navigate("/");
    }
  }, [username, navigate]);

  return (
    <Helmet title="Đăng nhập | Flux">
      <div className="login">
        <Search />
        {!username && (
          <>
            {!forgot ? (
              <form className="form" onSubmit={formik.handleSubmit}>
                <h3>Đăng nhập</h3>
                <SocialLogin />

                {/* Username */}
                <input
                  type="text"
                  name="username"
                  placeholder="Nhập tên đăng nhập"
                  className="box"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="error-msg">{formik.errors.username}</p>
                )}

                {/* Password */}
                <div className="form__input">
                  <input
                    type={eyeActive ? "text" : "password"}
                    name="password"
                    placeholder="Nhập mật khẩu"
                    className="box"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <i
                    className={`fa-solid ${
                      eyeActive ? "fa-eye-slash" : "fa-eye"
                    }`}
                    onClick={() => setEyeActive(!eyeActive)}
                  ></i>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="error-msg">{formik.errors.password}</p>
                )}

                {errorMsg && <p className="login__notifi">{errorMsg}</p>}
                <h4 onClick={() => setForgot(true)}>Quên mật khẩu?</h4>
                <button type="submit">Đăng nhập</button>
                <p className="login__footer">
                  Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
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
