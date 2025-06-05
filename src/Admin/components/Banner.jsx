import { useState, useEffect } from "react";
import {
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner,
} from "../../redux/apiRequest";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../../components/Modal";

const BannerManager = ({ accessToken }) => {
    const [banners, setBanners] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        img: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch all banners on mount
    useEffect(() => {
        const fetchBanners = async () => {
            setLoading(true);
            try {
                const data = await getAllBanners();
                setBanners(data);
            } catch (err) {
                setError("Failed to load banners");
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Open modal for creating a new banner
    const openCreateModal = () => {
        setFormData({ title: "", description: "", img: "" });
        setIsEditMode(false);
        setError("");
        setModalOpen(true);
    };

    // Open modal for editing a banner
    const openEditModal = (banner) => {
        setFormData({
            title: banner.title,
            description: banner.description,
            img: banner.img,
        });
        setCurrentBanner(banner);
        setIsEditMode(true);
        setError("");
        setModalOpen(true);
    };

    // Handle form submission (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.img) {
            setError("Image URL is required");
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                const updatedBanner = await updateBanner(currentBanner._id, formData);
                setBanners((prev) =>
                    prev.map((banner) =>
                        banner._id === updatedBanner._id ? updatedBanner : banner
                    )
                );
            } else {
                const newBanner = await createBanner(formData);
                setBanners((prev) => [...prev, newBanner]);
            }
            setModalOpen(false);
            setFormData({ title: "", description: "", img: "" });
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save banner");
        } finally {
            setLoading(false);
        }
    };

    // Handle banner deletion
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;

        setLoading(true);
        try {
            await deleteBanner({id, accessToken});
            setBanners((prev) => prev.filter((banner) => banner._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete banner");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="service-manager">
            <h2 className="service__title">Banner
                <button onClick={openCreateModal} className="btn primary">
                <i className="fa-solid fa-plus"></i>
                </button>
            </h2>


            {error && <p className="error">{error}</p>}

            {loading && <p className="loading">Loading...</p>}

            <div className="table-container">
                {banners.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Title</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.map((n) => (
                                <tr key={n._id}>
                                    <td>
                                        <img src={n.img} alt="" />
                                    </td>
                                    <td>{n.title}</td>
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
                        <h4>{isEditMode ? "Chỉnh sửa banner" : "Tạo Banner"}</h4>
                    </ModalTitle>
                    <ModalBody className="modal-body">
                        {error && <p className="error">{error}</p>}
                        <div className="modal-input-wrap">
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="modal-input-wrap">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="modal-input-wrap">
                            <label htmlFor="img">Image URL:</label>
                            <input
                                id="img"
                                name="img"
                                type="text"
                                placeholder="Image URL"
                                value={formData.img}
                                onChange={handleInputChange}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button onClick={() => setModalOpen(false)} className="btn cancel">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn primary"
                        >
                            {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
                        </button>
                    </ModalFooter>
                </Modal>
            )}
        </div>
    );
};

export default BannerManager;