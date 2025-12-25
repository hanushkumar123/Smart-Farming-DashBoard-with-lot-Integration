import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Card from '../components/Card';

import { useAuth } from '../context/AuthContext';

const Fields = () => {
    const { user } = useAuth();
    const [fields, setFields] = useState([]);
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        size: '',
        cropType: '',
        farm: '',
        status: 'Active'
    });
    const [editId, setEditId] = useState(null);

    // Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Fetch Data
    const fetchData = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const [fieldsRes, farmsRes] = await Promise.all([
                axios.get('/api/fields', config),
                axios.get('/api/farms', config)
            ]);
            setFields(fieldsRes.data);
            setFarms(farmsRes.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load data');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const resetForm = () => {
        setFormData({ name: '', location: '', size: '', cropType: '', farm: '', status: 'Active' });
        setEditId(null);
    };

    const handleOpenModal = (field = null) => {
        if (field) {
            setFormData({
                ...field,
                farm: field.farm?._id || field.farm || ''
            });
            setEditId(field._id);
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
                Authorization: `Bearer ${user?.token}`,
            },
        };
        try {
            const payload = { ...formData };
            if (!payload.farm) payload.farm = null;

            if (editId) {
                await axios.put(`/api/fields/${editId}`, payload, config);
                toast.success('Field updated successfully');
            } else {
                await axios.post('/api/fields', payload, config);
                toast.success('Field created successfully');
            }
            fetchData();
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
                Authorization: `Bearer ${user?.token}`,
            },
        };
        try {
            await axios.delete(`/api/fields/${deleteId}`, config);
            toast.success('Field deleted');
            fetchData();
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete field');
        }
    };

    if (loading) return <div className="p-8 text-center text-text-muted">Loading fields...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="h1">Field Configuration</h1>
                    <p className="body-text">Manage agricultural fields and their configuration</p>
                </div>
                <Button onClick={() => handleOpenModal()} icon={FaPlus}>
                    Add Field
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto -mx-6">
                    <table className="table-clean">
                        <thead className="table-header">
                            <tr>
                                <th className="px-6 py-3 text-left">Field Name</th>
                                <th className="px-6 py-3 text-left">Location</th>
                                <th className="px-6 py-3 text-left">Size (Acres)</th>
                                <th className="px-6 py-3 text-left">Crop Type</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light bg-bg-card">
                            {fields.length > 0 ? fields.map((field) => (
                                <tr key={field._id} className="hover:bg-primary-light/30 dark:hover:bg-primary-dark/20 transition-colors">
                                    <td className="table-cell font-medium text-text-primary">{field.name}</td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2 text-text-secondary">
                                            <FaMapMarkerAlt className="text-text-muted" />
                                            {field.location}
                                        </div>
                                    </td>
                                    <td className="table-cell">{field.size}</td>
                                    <td className="table-cell">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-50 dark:bg-slate-800 text-text-secondary border border-border-light dark:border-slate-700">
                                            {field.cropType}
                                        </span>
                                    </td>
                                    <td className="table-cell">
                                        <span className={`badge ${field.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                                            {field.status}
                                        </span>
                                    </td>
                                    <td className="table-cell text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(field)}
                                                className="p-1.5 text-text-muted hover:text-primary transition-colors"
                                                title="Edit Field"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(field._id)}
                                                className="p-1.5 text-text-muted hover:text-error transition-colors"
                                                title="Delete Field"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6">
                                        <div className="empty-state">
                                            <div className="empty-state-icon">
                                                <FaMapMarkerAlt />
                                            </div>
                                            <h3 className="empty-state-title">No Fields Created</h3>
                                            <p className="empty-state-desc">Start by adding your first agricultural field to track.</p>
                                            <Button onClick={() => handleOpenModal()} icon={FaPlus}>
                                                Add Your First Field
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editId ? 'Edit Field' : 'Add New Field'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Field Name</label>
                            <select
                                name="name"
                                required
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Select Field Name</option>
                                <optgroup label="Standard Fields">
                                    <option value="Field Alpha">Field Alpha</option>
                                    <option value="Field Beta">Field Beta</option>
                                    <option value="Field Gamma">Field Gamma</option>
                                    <option value="Field Delta">Field Delta</option>
                                    <option value="Field Epsilon">Field Epsilon</option>
                                    <option value="Field Zeta">Field Zeta</option>
                                    <option value="Field Eta">Field Eta</option>
                                    <option value="Field Theta">Field Theta</option>
                                </optgroup>
                                <optgroup label="Numbered Plots">
                                    <option value="Plot 101">Plot 101</option>
                                    <option value="Plot 102">Plot 102</option>
                                    <option value="Plot 103">Plot 103</option>
                                    <option value="Plot 201">Plot 201</option>
                                    <option value="Plot 202">Plot 202</option>
                                    <option value="Plot 301">Plot 301</option>
                                    <option value="Plot 302">Plot 302</option>
                                    <option value="Plot 401">Plot 401</option>
                                    <option value="Plot 402">Plot 402</option>
                                </optgroup>
                                <optgroup label="Sectors">
                                    <option value="Sector X-1">Sector X-1</option>
                                    <option value="Sector X-2">Sector X-2</option>
                                    <option value="Sector Y-1">Sector Y-1</option>
                                    <option value="Sector Y-2">Sector Y-2</option>
                                    <option value="Sector Z-1">Sector Z-1</option>
                                    <option value="Sector Z-9">Sector Z-9</option>
                                </optgroup>
                                <optgroup label="Functional Areas">
                                    <option value="Nursery Block A">Nursery Block A</option>
                                    <option value="Nursery Block B">Nursery Block B</option>
                                    <option value="Research Zone">Research Zone</option>
                                    <option value="Quarantine Area">Quarantine Area</option>
                                    <option value="Central Hub">Central Hub</option>
                                    <option value="North Extension">North Extension</option>
                                    <option value="South Annex">South Annex</option>
                                </optgroup>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <select
                                name="location"
                                required
                                className="form-input"
                                value={formData.location}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Select Location</option>
                                <option value="North Sector">North Sector</option>
                                <option value="South Field">South Field</option>
                                <option value="East Ridge">East Ridge</option>
                                <option value="West Valley">West Valley</option>
                                <option value="Greenhouse A">Greenhouse A</option>
                                <option value="Greenhouse B">Greenhouse B</option>
                                <option value="Greenhouse C">Greenhouse C</option>
                                <option value="Orchard Zone C">Orchard Zone C</option>
                                <option value="Riverside Plot">Riverside Plot</option>
                                <option value="Hilltop Area">Hilltop Area</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Size (Acres)</label>
                            <input
                                type="number"
                                name="size"
                                required
                                min="0"
                                step="0.1"
                                className="form-input"
                                placeholder="0.0"
                                value={formData.size}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Crop Type</label>
                            <select
                                name="cropType"
                                required
                                className="form-input"
                                value={formData.cropType}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Select Crop</option>
                                <option value="Wheat">Wheat</option>
                                <option value="Corn">Corn</option>
                                <option value="Rice">Rice</option>
                                <option value="Soybeans">Soybeans</option>
                                <option value="Cotton">Cotton</option>
                                <option value="Potatoes">Potatoes</option>
                                <option value="Tomatoes">Tomatoes</option>
                                <option value="Barley">Barley</option>
                                <option value="Sugarcane">Sugarcane</option>
                                <option value="Oats">Oats</option>
                                <option value="Sunflower">Sunflower</option>
                                <option value="Alfalfa">Alfalfa</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Assigned Farm</label>
                            <select
                                name="farm"
                                className="form-input"
                                value={formData.farm}
                                onChange={handleChange}
                            >
                                <option value="">No Farm Assigned</option>
                                {farms.map(farm => (
                                    <option key={farm._id} value={farm._id}>
                                        {farm.name} ({farm.location})
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-text-muted mt-1">Optional: Group this field under a farm.</p>
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
                            {editId ? 'Update Field' : 'Create Field'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Field Deletion"
            >
                <div className="space-y-4">
                    <p className="text-text-secondary">Are you sure you want to delete this field? This action cannot be undone.</p>
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
                            Delete Field
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Fields;
