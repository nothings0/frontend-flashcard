import { useState } from "react";
import Search from "../components/Search";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/apiRequest";
import Helmet from "../components/Helmet";
import Skeleton from "../components/Skeleton";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.middle);
  const [eyeActive, setEyeActive] = useState(false);
  const [eyeActive_1, setEyeActive_1] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { handleSubmit, handleBlur, handleChange, touched, errors, values } =
    useFormik({
      initialValues: {
        email: "",
        username: "",
        password: "",
        confirmedPassword: "",
        name: "",
      },
      validationSchema: Yup.object({
        username: Yup.string()
          .required("Bắt buộc")
          .min(6, "Tên đăng nhập phải có nhiều hơn 6 kí tự"),
        name: Yup.string().required("Bắt buộc"),
        email: Yup.string()
          .required("Bắt buộc")
          .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Nhập email hợp lệ"),
        password: Yup.string()
          .required("Bắt buộc")
          .matches(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            "Mật khẩu phải có nhiều hơn 8 kí tự, chứa ít nhất 1 chữ số, 1 chữ hoa"
          ),
        confirmedPassword: Yup.string()
          .required("Bắt buộc")
          .oneOf([Yup.ref("password"), null], "mật khẩu không đúng"),
      }),
      onSubmit: (values) => {
        const newUser = {
          username: values.username,
          email: values.email,
          password: values.password,
          name: values.name,
        };
        registerUser(newUser, navigate, dispatch, setErrorMsg);
      },
    });

  return (
    <Helmet title="Đăng ký | Flux">
      <div className="register">
        <Search />
        <form className="form" onSubmit={handleSubmit}>
          <h3>Đăng ký</h3>
          <div className="form__item">
            <input
              type="text"
              name="name"
              placeholder="Nhập họ và tên"
              className="box"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name && (
              <p className="errorMsg"> {errors.name} </p>
            )}
            <input
              type="text"
              name="username"
              placeholder="Nhập tên tài khoản"
              className="box"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.username && touched.username && (
              <p className="errorMsg"> {errors.username} </p>
            )}
          </div>
          <div className="form__item">
            <input
              type="text"
              name="email"
              placeholder="Nhập địa chỉ email"
              className="box"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && (
              <p className="errorMsg"> {errors.email} </p>
            )}
          </div>
          <div className="form__item">
            <div className="form__item__input">
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
            {errors.password && touched.password && (
              <p className="errorMsg"> {errors.password} </p>
            )}
          </div>
          <div className="form__item">
            <div className="form__item__input">
              <input
                type={eyeActive_1 ? "text" : "password"}
                name="confirmedPassword"
                placeholder="Xác nhận mật khẩu"
                className="box"
                value={values.confirmedPassword}
                onChange={handleChange}
              />
              {eyeActive_1 ? (
                <i
                  className="fa-solid fa-eye-slash"
                  onClick={() => setEyeActive_1(!eyeActive_1)}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-eye"
                  onClick={() => setEyeActive_1(!eyeActive_1)}
                ></i>
              )}
            </div>
            {errors.confirmedPassword && touched.confirmedPassword && (
              <p className="errorMsg"> {errors.confirmedPassword} </p>
            )}
          </div>
          {errorMsg && <p className="register__notifi">{errorMsg}</p>}
          <button type="submit">Đăng ký</button>
          <div className="form__des">
            Bạn đã có tài khoản ?<Link to="/login">Đăng nhập</Link>
          </div>
        </form>
        {loading && <Skeleton />}
      </div>
    </Helmet>
  );
};

export default Register;
