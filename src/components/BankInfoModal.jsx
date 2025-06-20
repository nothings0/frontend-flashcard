import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { updateBankAccount } from "../redux/apiRequest";
import { useSelector } from "react-redux";

const BankInfoModal = ({ onClose, data }) => {
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    fullName: data?.fullName || "",
    bankName: data?.bankName || "",
    bankAccountNumber: data?.bankAccountNumber || "",
  });

  const mutation = useMutation({
    mutationFn: () => updateBankAccount(form, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries(["affiliate-info"]);
      onClose();
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Cập nhật thông tin ngân hàng</h3>
        <input
          type="text"
          name="fullName"
          placeholder="Họ tên trên thẻ"
          value={form.fullName}
          onChange={handleChange}
          autoFocus
        />
        <input
          type="text"
          name="bankName"
          placeholder="Tên ngân hàng"
          value={form.bankName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="bankAccountNumber"
          placeholder="Số tài khoản"
          value={form.bankAccountNumber}
          onChange={handleChange}
        />
        <button onClick={() => mutation.mutate()} disabled={mutation.isLoading}>
          {mutation.isLoading ? "Đang lưu..." : "Lưu"}
        </button>
        <button className="close-btn" onClick={onClose}>
          Hủy
        </button>
      </div>
    </div>
  );
};

export default BankInfoModal;
