import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ForgotPasswordAPI } from "../../redux/apiRequest";
const ForgotPassword = ({ setForgot }) => {
  const [result, setResult] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      const user = {
        email: values.email,
      };
      try {
        const res = await ForgotPasswordAPI(user);
        setResult(res.data);
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <div className="forgot-password">
      <form className="form" onSubmit={formik.handleSubmit}>
        <h3>Quên mật khẩu</h3>
        {result?.length === 0 ? (
          <>
            <input
              type="text"
              name="email"
              placeholder="Nhập tài khoản email"
              className="box"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.errors.email && (
              <p className="errorMsg"> {formik.errors.email} </p>
            )}
            <button type="submit">Xác nhận</button>
          </>
        ) : (
          <p className="result">{result.msg || result}</p>
        )}
        <h4 onClick={() => setForgot(false)}>Quay lại đăng nhập</h4>
      </form>
    </div>
  );
};

export default ForgotPassword;
