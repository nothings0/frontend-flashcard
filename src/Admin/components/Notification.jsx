import { useState, useEffect } from "react";
import {
  GetNotifis,
  CreateNotifi,
  UpdateNotifi,
  DeleteNotifi,
} from "../../redux/apiRequest";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../../components/Modal";
import { useSelector } from "react-redux";

const Notification = () => {
  const accessToken = useSelector(
    (state) => state.user.currentUser?.accessToken
  );

  const [notifications, setNotifications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    url: "info",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await GetNotifis({ accessToken });

        setNotifications(res.data);
      } catch (err) {
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setFormData({ title: "", content: "", url: "info" });
    setIsEditMode(false);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (notification) => {
    setFormData({
      title: notification.title,
      content: notification.content,
      url: notification.url,
    });
    setIsEditMode(true);
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        const updated = await UpdateNotifi({ data: formData, accessToken });
        setNotifications((prev) =>
          prev.map((n) => (n._id === updated._id ? updated : n))
        );
      } else {
        const newOne = await CreateNotifi({ data: formData, accessToken });
        setNotifications((prev) => [...prev, newOne]);
      }
      setModalOpen(false);
      setFormData({ title: "", content: "", url: "info" });
    } catch (err) {
      setError(err.response?.data?.content || "Failed to save notification");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    setLoading(true);
    try {
      await DeleteNotifi({id, accessToken});
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError(err.response?.data?.content || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-manager">
      <h2 className="service__title">
        Thông báo
        <button onClick={openCreateModal} className="btn primary"><i className="fa-solid fa-plus"></i></button>
      </h2>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}

      <div className="table-container">
        {notifications.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr key={n._id}>
                  <td>{n.title}</td>
                  <td>{new Date(n.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="actions">
                      <button onClick={() => openEditModal(n)} className="btn edit">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => handleDelete(n._id)} className="btn delete">
                      <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && <p className="no-data">No notifications found</p>
        )}
      </div>

      {modalOpen && (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
          <ModalTitle fnClose={() => setModalOpen(false)}>
            <h4>{isEditMode ? "Chỉnh sửa thông báo" : "Tạo thông báo"}</h4>
          </ModalTitle>
          <ModalBody className="modal-body">
            {error && <p className="error">{error}</p>}
            <div className="modal-input-wrap">
              <label>Title:</label>
              <input name="title" value={formData.title} onChange={handleInputChange} />
            </div>
            <div className="modal-input-wrap">
              <label>Content:</label>
              <textarea name="content" value={formData.content} onChange={handleInputChange} />
            </div>
            <div className="modal-input-wrap">
              <label>URL:</label>
              <input name="url" value={formData.url} onChange={handleInputChange} />
            </div>
          </ModalBody>
          <ModalFooter>
            <button onClick={() => setModalOpen(false)} className="btn cancel">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="btn primary">
              {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
            </button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default Notification;
