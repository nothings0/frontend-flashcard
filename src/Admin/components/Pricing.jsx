import { useState, useEffect } from "react";
import {
    getPries,
    createPricing,
    updatePricing,
    deletePricing,
} from "../../redux/apiRequest";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../../components/Modal";

const PricingManager = ({ accessToken }) => {
    const [pricings, setPricings] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPricing, setCurrentPricing] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "",
        discount: 0,
        price: 0,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch all pricings on mount
    useEffect(() => {
        const fetchPricings = async () => {
            setLoading(true);
            try {
                const data = await getPries();
                setPricings(data);
            } catch (err) {
                setError("Failed to load pricings");
            } finally {
                setLoading(false);
            }
        };
        fetchPricings();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Open modal for creating a new pricing
    const openCreateModal = () => {
        setFormData({ title: "", description: "", type: "", discount: 0, price: 0 });
        setIsEditMode(false);
        setError("");
        setModalOpen(true);
    };

    // Open modal for editing a pricing
    const openEditModal = (pricing) => {
        setFormData({
            title: pricing.title,
            description: pricing.description,
            type: pricing.type,
            discount: pricing.discount,
            price: pricing.price,
        });
        setCurrentPricing(pricing);
        setIsEditMode(true);
        setError("");
        setModalOpen(true);
    };

    // Handle form submission (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            if (isEditMode) {
                const pricing = await updatePricing({id: currentPricing._id, data: formData, accessToken});
                const updatedPricing = pricing.pricing
                setPricings((prev) =>
                    prev.map((pricing) =>
                        pricing._id === updatedPricing._id ? updatedPricing : pricing
                    )
                );
            } else {
                const newPricing = await createPricing({data: formData, accessToken});
                setPricings((prev) => [...prev, newPricing]);
            }
            setModalOpen(false);
            setFormData({ title: "", description: "", type: "", discount: 0, price: 0 });
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save pricing");
        } finally {
            setLoading(false);
        }
    };

    // Handle pricing deletion
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this pricing?")) return;

        setLoading(true);
        try {
            await deletePricing({id, accessToken});
            setPricings((prev) => prev.filter((pricing) => pricing._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete pricing");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="service-manager">
            <h2 className="service__title">Pricing
                <button onClick={openCreateModal} className="btn primary">
                    <i className="fa-solid fa-plus"></i>
                </button>
            </h2>


            {error && <p className="error">{error}</p>}

            {loading && <p className="loading">Loading...</p>}

            <div className="table-container">
                {pricings.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {pricings.map((n) => (
                                <tr key={n._id}>
                                    <td>
                                        {n.title}
                                    </td>
                                    <td>{n.price.toLocaleString()}</td>
                                    <td>{n.discount}%</td>
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
                        <h4>{isEditMode ? "Edit Pricing" : "Create Pricing"}</h4>
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
                        <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
                            <div className="modal-input-wrap">
                                <label htmlFor="price">Price:</label>
                                <input
                                    id="price"
                                    name="price"
                                    type="text"
                                    placeholder="Image URL"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="modal-input-wrap">
                                <label htmlFor="discount">Discount:</label>
                                <input
                                    id="discount"
                                    name="discount"
                                    type="text"
                                    placeholder="Image URL"
                                    value={formData.discount}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="modal-input-wrap">
                            <label htmlFor="discount">Type:</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                            >
                                <option value="">-- Chọn loại --</option>
                                <option value="MONTHLY">Tháng</option>
                                <option value="YEARLY">Năm</option>
                            </select>
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

export default PricingManager;