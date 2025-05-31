import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Helmet from "../components/Helmet";
import Search from "../components/Search";
import Header from "../components/Header";
import {ChangePassword} from "../redux/apiRequest"
import { useDispatch, useSelector } from "react-redux";

const ChangePasswordPage = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.user.currentUser?.accessToken);

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Vui lòng nhập mật khẩu cũ"),
    newPassword: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Vui lòng nhập mật khẩu mới"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
  });

  const handleSubmit = async (values) => {
    await ChangePassword(values, accessToken, dispatch);
  };

  return (
    <Helmet title={`Đổi mật khẩu | Flux`}>
      <Search />
      <Header />
      <div className="change-password">
        <div className="change-password-container">
          <h2 className="change-password-heading">Đổi mật khẩu</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="change-password-form">
                <div className="form-group">
                  <label htmlFor="oldPassword">Mật khẩu cũ</label>
                  <Field
                    type="password"
                    name="oldPassword"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="oldPassword"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Mật khẩu mới</label>
                  <Field
                    type="password"
                    name="newPassword"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="form-error"
                  />
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Helmet>
  );
};

export default ChangePasswordPage;
