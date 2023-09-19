import { useState } from "react";
import { useDispatch } from "react-redux";
// import { useNavigate } from 'react-router-dom'
import { useFormik } from "formik";
import * as Yup from "yup";
import Footer from "../../components/Footer";
import Helmet from "../../components/Helmet";
import { ContactData } from "../../redux/apiRequest";

const Contact = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();
  // const navigate = useNavigate()

  const { handleSubmit, handleChange, values, errors, touched, handleBlur } =
    useFormik({
      initialValues: {
        title: "",
        email: "",
        description: "",
      },
      validationSchema: Yup.object({
        email: Yup.string()
          .required("Bắt buộc")
          .matches(
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            "Vui lòng nhập địa chỉ email hợp lệ"
          ),
        description: Yup.string().required("Bắt buộc"),
      }),
      onSubmit: async (values) => {
        const contactData = {
          title: values.title,
          email: values.email,
          description: values.description,
        };
        try {
          await ContactData(contactData, dispatch);
        } catch (err) {
          setErrorMsg(err.response.data);
        }
      },
    });

  return (
    <Helmet title="Liên hệ | Flux">
      <div className="contact">
        <div className="contact__header">Liên hệ chúng tôi</div>
        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__form__item">
            <p className="contact__form__title">Vấn đề cần liên hệ</p>
            <input
              type="text"
              className="contact__form__input"
              placeholder="Tóm tắt vấn đề ..."
              onChange={handleChange}
              name="title"
              value={values.title}
              onBlur={handleBlur}
            />
            {errors.title && touched.title && (
              <p className="other-page__error"> {errors.title} </p>
            )}
          </div>
          <div className="contact__form__item">
            <p className="contact__form__title">Email</p>
            <input
              type="text"
              className="contact__form__input"
              placeholder="Email của bạn ..."
              onChange={handleChange}
              name="email"
              value={values.email}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && (
              <p className="other-page__error"> {errors.email} </p>
            )}
          </div>
          <div className="contact__form__item">
            <p className="contact__form__title">Chi tiết vấn đề</p>
            <textarea
              rows="4"
              className="contact__form__input"
              placeholder="Chi tiết vấn đề ..."
              onChange={handleChange}
              name="description"
              value={values.description}
              onBlur={handleBlur}
            ></textarea>
            {errors.description && touched.description && (
              <p className="other-page__error"> {errors.description} </p>
            )}
          </div>
          {errorMsg && <p className="other-page__notifi">{errorMsg}</p>}
          <button type="submit">Contact</button>
        </form>
        <Footer />
      </div>
    </Helmet>
  );
};

export default Contact;
