import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateMultipleNotifi,
  GetContact,
  getPendingPremium,
  handleUpgrade,
} from "../redux/apiRequest";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../components/Modal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";

const Service = () => {
  const [contacts, setContacts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [notifiTitle, setNotifiTitle] = useState("");
  const [notifiContent, setNotifiContent] = useState("");
  const [notifiUrl, setNotifiUrl] = useState("");

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  // Fetch contact
  useEffect(() => {
    const fetchContacts = async () => {
      const res = await GetContact(accessToken);
      setContacts(res?.data || []);
    };
    fetchContacts();
  }, [accessToken]);

  // Fetch pending premium
  const { data: pendingData, isLoading } = useQuery({
    queryKey: "pending-premium",
    queryFn: () => getPendingPremium(accessToken),
    staleTime: 1000 * 60 * 60 * 6,
  });

  // Handle upgrade
  const upgradeMutation = useMutation({
    mutationFn: ({ slug, decision }) =>
      handleUpgrade(slug, accessToken, decision),
    onSuccess: () => {
      queryClient.invalidateQueries("pending-premium");
    },
  });

  const handlePremium = (slug, decision) => {
    upgradeMutation.mutate({ slug, decision });
  };

  const handleCreateNotifi = async () => {
    await CreateMultipleNotifi(dispatch, accessToken, {
      title: notifiTitle,
      content: notifiContent,
      url: notifiUrl,
    });
    setModalOpen(false);
    setNotifiTitle("");
    setNotifiContent("");
    setNotifiUrl("");
  };

  if (isLoading) return <p className="loading-text">Đang tải...</p>;

  return (
    <div className="service">
      {/* Liên hệ */}
      <div className="service__section service__contacts">
        <h2 className="service__title">Liên hệ từ người dùng</h2>
        {contacts.length > 0 ? (
          contacts.map((item, index) => (
            <div key={index} className="contact-item">
              <p><strong>Tiêu đề:</strong> {item.title}</p>
              <p><strong>Email:</strong> {item.email}</p>
              <p><strong>Mô tả:</strong> {item.description}</p>
            </div>
          ))
        ) : (
          <p className="service__empty">Không có email cần xử lý.</p>
        )}
      </div>

      {/* Thông báo */}
      <div className="service__section">
        <h2 className="service__title">Thông báo</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="service__btn service__btn--primary"
        >
          Tạo thông báo
        </button>
      </div>

      {/* Nâng cấp tài khoản */}
      <div className="service__section service__premium">
        <h2 className="service__title">Yêu cầu nâng cấp thẻ</h2>
        <div className="premium-grid">
          {pendingData?.data?.map((item) => (
            <div key={item.slug} className="premium-card">
              <Link className="premium-card__info" to={`/card/${item.slug}`}>
                <h4>{item.title}</h4>
                <p>Loại: {item.type}</p>
              </Link>
              <div className="premium-card__actions">
                <button
                  className="service__btn service__btn--accept"
                  onClick={() => handlePremium(item.slug, "premium")}
                >
                  Chấp nhận
                </button>
                <button
                  className="service__btn service__btn--reject"
                  onClick={() => handlePremium(item.slug, "regular")}
                >
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal tạo thông báo */}
      {modalOpen && (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
          <ModalTitle fnClose={() => setModalOpen(false)}>
            <h4>Tạo thông báo mới</h4>
          </ModalTitle>
          <ModalBody className="flex">
            <div className="modal-input-wrap">
              <label htmlFor="title">Tiêu đề:</label>
              <input
                type="text"
                id="title"
                placeholder="Tiêu đề"
                value={notifiTitle}
                onChange={(e) => setNotifiTitle(e.target.value)}
              />
            </div>
            <div className="modal-input-wrap">
              <label htmlFor="content">Nội dung:</label>
              <textarea
                id="content"
                placeholder="Nội dung"
                value={notifiContent}
                onChange={(e) => setNotifiContent(e.target.value)}
              />
            </div>
            <div className="modal-input-wrap">
              <label htmlFor="url">Đường dẫn:</label>
              <input
                id="url"
                type="text"
                placeholder="URL (tuỳ chọn)"
                value={notifiUrl}
                onChange={(e) => setNotifiUrl(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="service__btn service__btn--cancel"
              onClick={() => setModalOpen(false)}
            >
              Hủy
            </button>
            <button
              className="service__btn service__btn--primary"
              onClick={handleCreateNotifi}
            >
              Tạo
            </button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default Service;
