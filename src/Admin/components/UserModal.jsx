import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal, {
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "../../components/Modal";

const UserModal = ({ user, setModalOpen, handleSaveUser }) => {
  const [serverError, setServerError] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      name: "",
      plan: {
        type: "FREE",
        startDate: null,
        endDate: null,
      },
      isBlock: false,
      _id: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Vui lòng nhập username"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
      name: Yup.string(),
      plan: Yup.object({
        type: Yup.string()
          .required("Vui lòng chọn gói")
          .oneOf(["FREE", "MONTHLY", "YEARLY"], "Gói không hợp lệ"),
        startDate: Yup.string().nullable(), // Có thể thêm validation nếu bắt buộc
        endDate: Yup.string().nullable(), // Có thể thêm validation nếu bắt buộc
      }),
      isBlock: Yup.boolean(),
      password: !user
        ? Yup.string().required("Vui lòng nhập mật khẩu")
        : Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        await handleSaveUser({
          ...values,
          isBlock: values.isBlock === true || values.isBlock === "true",
        });
        setModalOpen(null);
      } catch (err) {
        const message =
          err?.response?.data?.msg || "Đã xảy ra lỗi khi lưu người dùng";
        setServerError(message);
      }
    },
  });

  useEffect(() => {
    if (user) {
      formik.setValues({
        _id: user._id || "",
        username: user.username || "",
        email: user.email || "",
        password: "HACKED",
        name: user.name || "",
        isBlock: user.isBlock || false,
        plan: {
          type: user.plan?.type || "FREE",
          startDate: user.plan?.startDate || null,
          endDate: user.plan?.endDate || null,
        },
      });
    }
  }, [user]);

  return (
    <Modal modalOpen={true} setModalOpen={() => setModalOpen(null)}>
      <ModalTitle fnClose={() => setModalOpen(null)}>
        {user?.view
          ? "Thông tin người dùng"
          : user?._id
          ? "Chỉnh sửa người dùng"
          : "Thêm người dùng"}
      </ModalTitle>

      <form onSubmit={formik.handleSubmit}>
        <ModalBody className="flex">
          <div className="modal-input-wrap">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={user && user.username}
              placeholder="Nhập username"
            />
            {formik.touched.username && formik.errors.username && (
              <div className="error">{formik.errors.username}</div>
            )}
          </div>

          <div className="modal-input-wrap">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={user?.view || user?._id}
              placeholder="Nhập email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error">{formik.errors.email}</div>
            )}
          </div>

          <div className="modal-input-wrap">
            <label htmlFor="name">Tên:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={user?.view}
              placeholder="Nhập tên"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="error">{formik.errors.name}</div>
            )}
          </div>

          {user?.view && (
            <>
              <div className="modal-input-wrap">
                <label htmlFor="bio">Bio:</label>
                <input
                  type="text"
                  id="bio"
                  value={user?.bio || ""}
                  disabled={user?.view}
                />
              </div>
            </>
          )}
          {!user._id && (
            <div className="modal-input-wrap">
              <label htmlFor="password">Mật khẩu:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Nhập mật khẩu"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="error">{formik.errors.password}</div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="modal-input-wrap">
              <label htmlFor="plan">Gói?</label>
              <select
                id="plan"
                name="plan.type"
                value={formik.values.plan.type}
                onChange={(e) => {
                  formik.setFieldValue("plan.type", e.target.value);
                  // Nếu cần cập nhật startDate và endDate khi thay đổi gói, thêm logic ở đây
                  formik.setFieldValue(
                    "plan.startDate",
                    new Date().toISOString()
                  ); // Ví dụ
                  formik.setFieldValue(
                    "plan.endDate",
                    new Date().toISOString()
                  ); // Ví dụ
                }}
                disabled={user?.view}
              >
                <option value="FREE">FREE</option>
                <option value="MONTHLY">MONTHLY</option>
                <option value="YEARLY">YEARLY</option>
              </select>
              {formik.touched.plan?.type && formik.errors.plan?.type && (
                <div className="error">{formik.errors.plan.type}</div>
              )}
            </div>
            <div className="modal-input-wrap">
              <label htmlFor="isBlock">Đã khóa?</label>
              <select
                id="isBlock"
                name="isBlock"
                value={formik.values.isBlock}
                onChange={formik.handleChange}
                disabled={user?.view}
              >
                <option value={false}>Không khóa</option>
                <option value={true}>Khóa</option>
              </select>
            </div>
          </div>

          {serverError && <p className="error-msg">{serverError}</p>}
        </ModalBody>

        <ModalFooter>
          <button
            type="button"
            onClick={() => setModalOpen(null)}
            className="cancle-btn"
          >
            Quay lại
          </button>
          {!user?.view && (
            <button type="submit" className="ok-btn">
              {formik.isSubmitting ? "Đang lưu..." : user ? "Lưu" : "Tạo"}
            </button>
          )}
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default UserModal;
