import React, { useEffect, useState } from 'react';
import Search from "../components/Search";
import Helmet from "../components/Helmet";
import { getPries, createInvoice } from '../redux/apiRequest';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../redux/toastSlice';

const Pricing = () => {
    const dispatch = useDispatch();
    const [prices, setPrices] = useState([]);
    const accessToken = useSelector(
        (state) => state.user.currentUser?.accessToken
    );
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await getPries();
                setPrices(res);
            } catch (err) { }
        };
        getData();
    }, []);

    const onHandleCreateInvoice = async (planType, amount) => {
        
        try {
            if(!accessToken) {
                dispatch(showToast({ msg: "Vui lòng đăng nhập để nâng cấp tài khoản!", success: false }));
                navigate("/login");
                return;
            }

            const res = await createInvoice({ planType, amount, accessToken });

            const invoice = res?.invoice;

            navigate(`/payment/${invoice.id}`);
        } catch (err) {
            console.error("Lỗi tạo invoice:", err);

            // Nếu server trả về msg và code
            if (err?.code === 400) {
                dispatch(showToast({ msg: err?.msg || "Gói hiện tại vẫn còn hiệu lực!", success: false }));
                return;
            }
            dispatch(showToast({ msg: err?.msg || "Tạo hóa đơn thất bại!", success: false }));
        }
    };

    const monthPrice = prices.find(item => item.type === 'MONTHLY');

    return (
        <Helmet title="Nâng cấp tài khoản | Flux">
            <Search />
            <div className="quizlet-banner">
                <div className="banner-content">
                    <h1 className="title">FluxQuiz Plus</h1>
                    <h2 className="subtitle">
                        ĐĂNG KÝ LẦN ĐẦU TIÊN GIÁ {monthPrice?.price.toLocaleString()}đ
                    </h2>
                    <p className="description">
                        Ưu đãi có giới hạn: Nâng cấp lên gói FluxQuiz Plus với giá chỉ {monthPrice?.price.toLocaleString()}đ cho tháng đầu tiên. Sau đó sẽ quay lại giá gốc
                    </p>
                </div>

                <div className="subscription-options">
                    {
                        prices.map((item, index) => {
                            if (item.type === 'MONTHLY') {
                                return (
                                    <div className="subscription-card" key={index}>
                                        <div className="discount-label">Giảm giá {item.discount}%</div>
                                        <h3 className="card-title">{item.title}</h3>
                                        <div>
                                            <p className="card-description">{item.description}</p>
                                            <p className="price">{item.price.toLocaleString()}đ<span> /tháng</span></p>
                                        </div>
                                        <button className="start-trial-btn" onClick={() => onHandleCreateInvoice(item.type, item.price)}>Bắt đầu dùng thử miễn phí</button>
                                    </div>
                                )
                            } else {
                                return (
                                    <div className="subscription-card" key={index}>
                                        <div className="discount-label">Giảm giá {item.discount}%</div>
                                        <h3 className="card-title">{item.title}</h3>
                                        <div>
                                            <p className="card-description">{item.description}</p>
                                            <p className="price">{Math.floor(item.price / 12).toLocaleString("vi-VN")}đ
                                            <span> /tháng</span></p>
                                        </div>
                                        <button className="buy-now-btn" onClick={() => onHandleCreateInvoice(item.type, item.price)}>Mua FluxQuiz Plus</button>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
            <FAQ />
        </Helmet>
    );
};

const FAQ = () => {
    // State to track which FAQ item is expanded
    const [expanded, setExpanded] = useState(null);

    // FAQ data
    const faqData = [
        {
            question: 'Tôi có thể hủy gói đăng ký Pro bất cứ lúc nào không?',
            answer:
                'Có chứ, bạn có thể hủy gia hạn tự động bất cứ lúc nào sau khi bạn đã thanh toán cho gói đăng ký. Những tính năng có trả tiền sẽ vẫn có hiệu lực cho tới cuối kỳ đăng ký của bạn. Nếu bạn mua một gói Tron đời, bạn sẽ không cần hủy gia hạn tự động bởi đó là gói thanh toán một lần duy nhất.',
        },
        {
            question: 'Gói thành viên của tôi có áp dụng cho toàn bộ nguồn gốc không?',
            answer:
                'Gói FluxQuiz của bạn áp dụng cho tất cả nguồn gốc của bạn thay vì chỉ cho các nguồn gốc cụ thể. Điều này có nghĩa là bạn sẽ có thể truy cập tất cả các nội dung với tất cả các nguồn gốc có sẵn trên ứng dụng và trang web.',
        },
        {
            question: 'Tôi có thể học nhiều hơn một nguồn gốc trên tài khoản của mình không?',
            answer:
                'Trên FluxQuiz, bạn có thể truy cập và học nhiều nguồn gốc từ thích mà bạn muốn cùng một lúc!',
        },
        {
            question: 'Gói Tron đời hoạt động như thế nào?',
            answer: 'Nếu bạn chọn gói Trọn đời, số tiền sẽ được tính dưới dạng thanh toán trả trước một lần mà không cần gia hạn và bạn sẽ sở hữu trạng thái Pro mãi mãi.',
        },
        {
            question: 'Tôi có thể sử dụng tài khoản trên nhiều thiết bị được không?',
            answer: 'Được! Bạn có thể truy cập hồ sơ Memrise và sử dụng gói thành viên Pro của mình trên nhiều thiết bị: chỉ cần đăng nhập với các thông tin chi tiết giống nhau trên ứng dụng di động iOS và Android hoặc trên máy tính của bạn.',
        },
    ];

    // Toggle expand/collapse for a specific FAQ item
    const toggleFAQ = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    return (
        <div className="faq-section">
            <h2 className="faq-title">Câu hỏi thường gặp</h2>
            {faqData.map((faq, index) => (
                <div className="faq-item" key={index}>
                    <div
                        className="faq-question"
                        onClick={() => toggleFAQ(index)}
                    >
                        <h3>{faq.question}</h3>
                        <span className={`arrow ${expanded === index ? 'expanded' : ''}`}>
                            {expanded === index ? <i className="fas fa-angle-up"></i> : <i className="fas fa-angle-down"></i>}
                        </span>
                    </div>
                    {expanded === index && (
                        <div className="faq-answer">
                            <p>{faq.answer}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Pricing;