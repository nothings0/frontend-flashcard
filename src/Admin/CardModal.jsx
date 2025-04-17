import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal, { ModalTitle, ModalBody, ModalFooter } from '../components/Modal';

const CardModal = ({ card, setModalOpen, handleSaveCard }) => {
    const [serverError, setServerError] = useState(null);

    const formik = useFormik({
        initialValues: {
            title: '',
            type: '',
            description: '',
            json: '',
            background: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Vui lòng nhập tiêu đề'),
            type: Yup.string(),
            description: Yup.string(),
            json: Yup.string(),
            background: Yup.string(),
        }),
        onSubmit: async (values) => {
            console.log('values', values);
            
            try {
                await handleSaveCard({
                    ...card,
                    ...values,
                });
            } catch (err) {
                const message = err?.response?.data?.msg || 'Đã xảy ra lỗi khi lưu thẻ';
                setServerError(message);
            }
        },
    });

    useEffect(() => {
        if (card) {
            formik.setValues({
                title: card.title || '',
                type: card.type || '',
                description: card.description || '',
                json: card.json || '',
                background: card.background || '',
            });
        }
    }, [card]);
    

    return (
        <Modal modalOpen={true} setModalOpen={() => setModalOpen(null)}>
            <ModalTitle fnClose={() => setModalOpen(null)}>
                {card?.view
                    ? 'Thông tin thẻ'
                    : card?._id ? 'Chỉnh sửa thẻ' : 'Thêm thẻ'}
            </ModalTitle>

            <form onSubmit={formik.handleSubmit}>
                <ModalBody className="flex">
                    <div className="modal-input-wrap">
                        <label htmlFor="title">Tiêu đề:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Nhập tiêu đề"
                            disabled={card?.view}
                        />
                        {formik.touched.title && formik.errors.title && (
                            <div className="error">{formik.errors.title}</div>
                        )}
                    </div>

                    <div className="modal-input-wrap">
                        <label htmlFor="type">Loại:</label>
                        <select
                            id="type"
                            name="type"
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            disabled={card?.view}
                        >
                            <option value="">-- Chọn loại --</option>
                            <option value="REGULAR">Regular</option>
                            <option value="PREMIUM">Premium</option>
                            <option value="PROMAX">Promax</option>
                        </select>
                        {formik.touched.type && formik.errors.type && (
                            <div className="error">{formik.errors.type}</div>
                        )}
                    </div>

                    <div className="modal-input-wrap">
                        <label htmlFor="description">Nội dung:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            placeholder="Nhập nội dung"
                            disabled={card?.view}
                        />
                    </div>

                    {
                        !card._id &&
                        <div className="modal-input-wrap">
                            <label htmlFor="json">Danh sách từ vựng (JSON):</label>
                            <textarea
                                id="json"
                                name="json"
                                value={formik.values.json}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder='[{ "prompt": "apple", "answer": "quả táo" }]'
                            />
                            {formik.touched.json && formik.errors.json && (
                                <div className="error">{formik.errors.json}</div>
                            )}
                        </div>
                    }

                    <div className="modal-input-wrap">
                        <label htmlFor="background">Màu nền (hex hoặc URL ảnh):</label>
                        <input
                            type="text"
                            id="background"
                            name="background"
                            value={formik.values.background}
                            onChange={formik.handleChange}
                            placeholder="VD: #f5f5f5 hoặc https://..."
                            disabled={card?.view}
                        />
                    </div>

                    {serverError && <p className="error-msg">{serverError}</p>}
                </ModalBody>

                <ModalFooter>
                    <button type="button" onClick={() => setModalOpen(null)} className="cancle-btn">
                        Quay lại
                    </button>
                    {!card?.view && (
                        <button type="submit" className="ok-btn">
                            {formik.isSubmitting ? 'Đang lưu...' : card?._id ? 'Lưu' : 'Tạo'}
                        </button>
                    )}
                </ModalFooter>
            </form>
        </Modal>
    );
};

export default CardModal;
