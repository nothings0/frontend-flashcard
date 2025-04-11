// PaymentPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvoice } from "../redux/apiRequest";
import Skeleton from "../components/Skeleton";
import { useSelector } from "react-redux";

function PaymentPage() {
    const { invoiceId } = useParams();
    const [invoice, setInvoice] = useState(null);
    const accessToken = useSelector(
        (state) => state.user.currentUser?.accessToken
    );
    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await getInvoice({ invoiceId, accessToken })
                setInvoice(res);
            } catch (err) {
                console.error("Lỗi load hóa đơn:", err);
            }
        };

        fetchInvoice();
    }, [invoiceId]);

    if (!invoice) return <Skeleton type="loading" />;

    const qrUrl = `https://qr.sepay.vn/img?bank=BIDV&acc=5120925919&template=compact&amount=${invoice.amount}&addInfo=${invoice.refCode}&accountName=PHAM VAN NHAN`;

    return (
        <div className="max-w-4xl mx-auto p-6 border rounded-md shadow-md bg-white mt-10">
            <h2 className="text-xl font-semibold text-center mb-6">
                Hướng dẫn thanh toán qua chuyển khoản ngân hàng
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cột trái */}
                <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Cách 1: Mở app ngân hàng và quét mã QR</h3>
                    <img src={qrUrl} alt="QR Code" className="w-64 h-64 mx-auto mb-2" />
                    <a href={qrUrl} download className="text-blue-500 underline">
                        ⬇ Tải ảnh QR
                    </a>
                    <p className="mt-2 text-sm text-gray-500">
                        Trạng thái: <span className="font-medium">Chờ thanh toán...</span>
                    </p>
                </div>

                {/* Cột phải */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Cách 2: Chuyển khoản thủ công theo thông tin</h3>
                    <div className="space-y-2 text-sm">
                        <p><strong>Ngân hàng:</strong> BIDV</p>
                        <p><strong>Chủ tài khoản:</strong> PHẠM VĂN NHÂN</p>
                        <p><strong>Số tài khoản:</strong> 5120925919</p>
                        <p><strong>Số tiền:</strong> {invoice.amount.toLocaleString()}đ</p>
                        <p><strong>Nội dung CK:</strong> <span className="text-red-600 font-semibold">{invoice.refCode}</span></p>
                        <p className="text-sm mt-2 text-gray-600">
                            <strong>Lưu ý:</strong> Vui lòng giữ nguyên nội dung chuyển khoản <strong>{invoice.refCode}</strong> để hệ thống tự động xác nhận thanh toán.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;