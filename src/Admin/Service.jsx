import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateMultipleNotifi, GetContact } from "../redux/apiRequest";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../components/Modal";

const Service = () => {
  const [contacts, setContacts] = useState([]);
  const [content, setContent] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const res = await GetContact(accessToken);
      setContacts(res);
    };
    getData();
  }, [accessToken]);

  const handleNotifi = async () => {
    await CreateMultipleNotifi(dispatch, accessToken, { content });
  };

  return (
    <div className="service">
      <div className="contact">
        {contacts?.length > 0 ? (
          contacts.map((item) => (
            <div className="contact__item">
              <div className="contact__txt">Tiêu đề: {item.title}</div>
              <div className="contact__txt">Email: {item.email}</div>
              <div className="contact__txt">
                Description: {item.description}
              </div>
            </div>
          ))
        ) : (
          <h3>Không có email cần xử lý</h3>
        )}
      </div>
      <div className="service__button">
        <button onClick={() => setModalOpen(true)}>Tạo thông báo</button>
      </div>
      {modalOpen && (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
          <ModalTitle fnClose={() => setModalOpen(false)}>
            <h4>Tạo thông báo mới</h4>
          </ModalTitle>
          <ModalBody>
            <div className="service__notifi">
              <textarea
                type="text"
                id="notifi"
                placeholder="Nhập nội dung"
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="cancel-btn"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Hủy
            </button>
            <button
              className="ok-btn"
              onClick={() => {
                handleNotifi();
                setModalOpen(false);
              }}
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
