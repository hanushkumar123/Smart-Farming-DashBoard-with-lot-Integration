import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaWarehouse, FaMapMarkerAlt, FaCheckCircle, FaBan } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

const Farms = () => {
    const { user: currentUser } = useAuth();
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        status: 'Active'
    });
    const [editId, setEditId] = useState(null);

    // Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Fetch Farms
    const fetchFarms = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${currentUser?.token}`,
                },
            };
            const res = await axios.get('/api/farms', config);
            setFarms(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load farms');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchFarms();
        }
    }, [currentUser]);

    const resetForm = () => {
        setFormData({ name: '', location: '', description: '', status: 'Active' });
        setEditId(null);
    };

    const handleOpenModal = (farm = null) => {
        if (farm) {
            setFormData(farm);
            setEditId(farm._id);
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                Authorization: `Bearer ${currentUser?.token}`,
            },
        };
        try {
            if (editId) {
                await axios.put(`/api/farms/${editId}`, formData, config);
                toast.success('Farm updated successfully');
            } else {
                await axios.post('/api/farms', formData, config);
                toast.success('Farm created successfully');
            }
            fetchFarms();
            handleCloseModal();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        const config = {
            headers: {
                Authorization: `Bearer ${currentUser?.token}`,
            },
        };
        try {
            await axios.delete(`/api/farms/${deleteId}`, config);
            toast.success('Farm deleted');
            fetchFarms();
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete farm');
        }
    };

    if (loading) return <div className="p-8 text-center text-text-muted">Loading farms...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="h1">Farm Locations</h1>
                    <p className="body-text">Manage top-level farm entities</p>
                </div>
                <Button onClick={() => handleOpenModal()} icon={FaPlus}>
                    Add Farm
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farms.length > 0 ? farms.map((farm) => (
                    <Card key={farm._id} className="hover:shadow-lg transition-shadow bg-bg-card flex flex-col h-full">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-primary flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                                    <FaWarehouse />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary">{farm.name}</h3>
                                    <div className="flex items-center gap-1 text-xs text-text-secondary">
                                        <FaMapMarkerAlt className="text-text-muted" />
                                        {farm.location}
                                    </div>
                                </div>
                            </div>
                            <span className={`badge ${farm.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                                {farm.status}
                            </span>
                        </div>

                        <p className="text-sm text-text-secondary mb-4 h-10 overflow-hidden text-ellipsis line-clamp-2">
                            {farm.description || 'No description provided.'}
                        </p>

                        <div className="pt-4 border-t border-border-light flex justify-between items-center mt-auto">
                            <span className="text-xs text-text-muted font-medium">Added {new Date(farm.createdAt).toLocaleDateString()}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(farm)}
                                    className="p-1.5 text-text-muted hover:text-primary transition-colors"
                                    title="Edit Farm"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(farm._id)}
                                    className="p-1.5 text-text-muted hover:text-error transition-colors"
                                    title="Delete Farm"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </Card>
                )) : (
                    <div className="col-span-full">
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <FaWarehouse />
                            </div>
                            <h3 className="empty-state-title">No Farms Found</h3>
                            <p className="empty-state-desc">Create your first farm location to group fields.</p>
                            <Button onClick={() => handleOpenModal()} icon={FaPlus}>
                                Create Farm
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editId ? 'Edit Farm' : 'Add New Farm'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="form-group">
                            <label className="form-label">Farm Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Green Valley Estate"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Location / Region</label>
                            <input
                                type="text"
                                name="location"
                                required
                                className="form-input"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. California, North Sector"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                className="form-input"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Brief description of the farm..."
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                className="form-input"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border-light">
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {editId ? 'Update Farm' : 'Create Farm'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Farm Deletion"
            >
                <div className="space-y-4">
                    <p className="text-text-secondary">Are you sure you want to delete this farm? This action cannot be undone and may affect linked fields.</p>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                        >
                            Delete Farm
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Farms;
