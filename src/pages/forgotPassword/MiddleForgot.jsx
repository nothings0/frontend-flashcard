import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { checkTokenExp } from "../../util/checkToken";
// import Search from '../components/Search'
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { useDispatch } from 'react-redux'
import { resetPassword } from "../../redux/apiRequest";
// import Helmet from '../components/Helmet';

const MiddleForgot = () => {
  const { slug } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const handleToken = async () => {
      const res = await checkTokenExp(slug);
      if (res) {
        setMsg(res);
      }
    };
    handleToken();
  }, [slug]);
  const [eyeActive, setEyeActive] = useState(false);
  const [eyeActive_1, setEyeActive_1] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmedPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required("Required")
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
          "mật khẩu phải có nhiều hơn 8 kí tự, chứa ít nhất 1 chữ số"
        ),
      confirmedPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), null], "mật khẩu không đúng"),
    }),
    onSubmit: (values) => {
      const password = {
        password: values.password,
      };
      resetPassword(password, navigate, slug);
    },
  });

  return (
    <div className="register">
      {msg.length === 0 ? (
        <form className="form" onSubmit={formik.handleSubmit}>
          <h3>Thay đổi mật khẩu</h3>
          <div className="form__item">
            <div className="form__item__input">
              <input
                type={eyeActive ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                className="box"
                value={formik.values.password}
                onChange={formik.handleChange}
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
            {formik.errors.password && (
              <p className="errorMsg"> {formik.errors.password} </p>
            )}
          </div>
          <div className="form__item">
            <div className="form__item__input">
              <input
                type={eyeActive_1 ? "text" : "password"}
                name="confirmedPassword"
                placeholder="Xác nhận mật khẩu"
                className="box"
                value={formik.values.confirmedPassword}
                onChange={formik.handleChange}
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
            {formik.errors.confirmedPassword && (
              <p className="errorMsg"> {formik.errors.confirmedPassword} </p>
            )}
          </div>
          <button type="submit">Xác nhận</button>
        </form>
      ) : (
        <h3>{msg}</h3>
      )}
    </div>
  );
};

export default MiddleForgot;
