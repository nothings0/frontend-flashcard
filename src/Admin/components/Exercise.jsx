import { useState, useEffect } from "react";
import {
    getExercises,
    createExercise,
    updateExercise,
    deleteExercise,
} from "../../redux/apiRequest";
import Modal, { ModalBody, ModalFooter, ModalTitle } from "../../components/Modal";
import { Link } from "react-router-dom";

const ExerciseManager = ({ accessToken }) => {
    const [exercises, setExercises] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentExercise, setCurrentExercise] = useState(null);
    const [formData, setFormData] = useState({
        slug: "",
        level: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch all exercises on mount
    useEffect(() => {
        const fetchExercises = async () => {
            setLoading(true);
            try {
                const data = await getExercises();
                setExercises(data);
            } catch (err) {
                setError("Failed to load exercises");
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Open modal for creating a new exercise
    const openCreateModal = () => {
        setFormData({ slug: "", level: "" });
        setIsEditMode(false);
        setError("");
        setModalOpen(true);
    };

    // Open modal for editing a exercise
    const openEditModal = (exercise) => {
        setFormData({
            slug: exercise.slug,
            level: exercise.level,
        });
        setCurrentExercise(exercise);
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
                const exercise = await updateExercise({id: currentExercise._id, data: formData, accessToken});
                const updatedExercise = exercise.exercise
                setExercises((prev) =>
                    prev.map((exercise) =>
                        exercise._id === updatedExercise._id ? updatedExercise : exercise
                    )
                );
            } else {
                const newExercise = await createExercise({data: formData, accessToken});
                setExercises((prev) => [...prev, newExercise]);
            }
            setModalOpen(false);
            setFormData({ slug: "", level: "" });
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save exercise");
        } finally {
            setLoading(false);
        }
    };

    // Handle exercise deletion
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this exercise?")) return;

        setLoading(true);
        try {
            await deleteExercise({id, accessToken});
            setExercises((prev) => prev.filter((exercise) => exercise._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete exercise");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="service-manager">
            <h2 className="service__title">Quản lý lyric
                <button onClick={openCreateModal} className="btn primary">
                    <i className="fa-solid fa-plus"></i>
                </button>
            </h2>


            {error && <p className="error">{error}</p>}

            {loading && <p className="loading">Loading...</p>}

            <div className="table-container">
                {exercises.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>slug</th>
                                <th>level</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {exercises.map((n) => (
                                <tr key={n._id}>
                                    <td>
                                        <Link to={`/lyric/${n.slug}`}>{n.title}</Link>
                                    </td>
                                    <td>
                                        {n.level}
                                    </td>
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
                        <h4>{isEditMode ? "Chỉnh sửa lyric" : "Tạo lyric"}</h4>
                    </ModalTitle>
                    <ModalBody className="modal-body">
                        {error && <p className="error">{error}</p>}
                        <div className="modal-input-wrap">
                            <label htmlFor="slug">Slug:</label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                placeholder="Slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="modal-input-wrap">
                            <label htmlFor="level">Level:</label>
                            <select
                                id="level"
                                name="level"
                                value={formData.level}
                                onChange={handleInputChange}
                            >
                                <option value="">-- Chọn loại --</option>
                                <option value="BEGINNER">BEGINNER</option>
                                <option value="INTERMEDIATE">INTERMEDIATE</option>
                                <option value="ADVANCED">ADVANCED</option>
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

export default ExerciseManager;