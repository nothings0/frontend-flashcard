import { useEffect } from "react";
import Modal, { ModalTitle, ModalBody } from "../../components/Modal";
import { getRequestWithdrawal } from "../../redux/apiRequest";
import { useQueryClient } from "react-query";

const QRModal = ({ data, onClose, accessToken }) => {
    const queryClient = useQueryClient()
  const qrUrl = `https://qr.sepay.vn/img?acc=${data.bankAccount.bankAccountNumber}&bank=${data.bankAccount.bankName}&amount=${data.amount}&des=SEVQR+${data.code}&template=compact`;

  useEffect(() => {
    if (data.status === "SUCCESS") return;

    const intervalId = setInterval(async () => {
      try {
        const res = await getRequestWithdrawal(data._id, accessToken);
        if (res.status === "SUCCESS") {
          clearInterval(intervalId);
          queryClient.invalidateQueries("admin-withdrawals")
          onClose()
        }
      } catch (err) {
        console.error("Lỗi kiểm tra trạng thái:", err);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [data]);

  return (
    <Modal modalOpen={true} setModalOpen={onClose}>
      <ModalTitle fnClose={onClose}>Thanh toán</ModalTitle>
      <ModalBody>
        {
          data.status === "SUCCESS" ? <p>✅ Đã thanh toán</p> :
        <img src={qrUrl} alt="QR Code" className="qr-image" />
        }
      </ModalBody>
    </Modal>
  );
};

export default QRModal;
