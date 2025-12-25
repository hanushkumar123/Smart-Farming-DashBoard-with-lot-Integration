import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaWifi } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Card from '../components/Card';

import { useAuth } from '../context/AuthContext';

const Sensors = () => {
    const { user } = useAuth();
    const [sensors, setSensors] = useState([]);
    const [fields, setFields] = useState([]); // For dropdown
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        sensorId: '',
        type: 'Moisture',
        assignedField: '',
        minThreshold: '',
        maxThreshold: '',
        status: 'Enabled'
    });
    const [editId, setEditId] = useState(null);
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
            const [sensorsRes, fieldsRes] = await Promise.all([
                axios.get('/api/sensors', config),
                axios.get('/api/fields', config)
            ]);
            setSensors(sensorsRes.data);
            setFields(fieldsRes.data);
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
        setFormData({
            sensorId: '',
            type: 'Moisture',
            assignedField: '',
            minThreshold: '',
            maxThreshold: '',
            status: 'Enabled'
        });
        setEditId(null);
    };

    const handleOpenModal = (sensor = null) => {
        if (sensor) {
            setFormData({
                sensorId: sensor.sensorId,
                type: sensor.type,
                assignedField: sensor.assignedField?._id || sensor.assignedField || '',
                minThreshold: sensor.minThreshold || '',
                maxThreshold: sensor.maxThreshold || '',
                status: sensor.status
            });
            setEditId(sensor._id);
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
            // Sanitize payload to prevent CastErrors
            if (payload.assignedField === '') payload.assignedField = null;
            if (payload.minThreshold === '') payload.minThreshold = null;
            if (payload.maxThreshold === '') payload.maxThreshold = null;

            if (editId) {
                await axios.put(`/api/sensors/${editId}`, payload, config);
                toast.success('Sensor updated successfully');
            } else {
                await axios.post('/api/sensors', payload, config);
                toast.success('Sensor created successfully');
            }
            fetchData(); // Reload to get populated fields
            handleCloseModal();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = (id) => {
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
            await axios.delete(`/api/sensors/${deleteId}`, config);
            toast.success('Sensor deleted');
            fetchData();
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete sensor');
        }
    };

    if (loading) return <div className="p-8 text-center text-text-muted">Loading sensors...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="h1">Sensor Configuration</h1>
                    <p className="body-text">Monitor real-time data from IoT devices</p>
                </div>
                <Button onClick={() => handleOpenModal()} icon={FaPlus}>
                    Add Sensor
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto -mx-6">
                    <table className="table-clean">
                        <thead className="table-header">
                            <tr>
                                <th className="px-6 py-3 text-left">Sensor ID</th>
                                <th className="px-6 py-3 text-left">Type</th>
                                <th className="px-6 py-3 text-left">Assigned Field</th>
                                <th className="px-6 py-3 text-left">Thresholds</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light bg-bg-card">
                            {sensors.length > 0 ? sensors.map((sensor) => (
                                <tr key={sensor._id} className="hover:bg-primary-light/30 dark:hover:bg-primary-dark/20 transition-colors">
                                    <td className="table-cell font-medium text-text-primary flex items-center gap-2">
                                        <FaWifi className="text-text-muted text-xs" />
                                        {sensor.sensorId}
                                    </td>
                                    <td className="table-cell">{sensor.type}</td>
                                    <td className="table-cell">
                                        {sensor.assignedField ? (
                                            <span className="text-text-secondary font-medium">{sensor.assignedField.name}</span>
                                        ) : (
                                            <span className="text-text-muted italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="table-cell">
                                        {sensor.minThreshold !== undefined && sensor.maxThreshold !== undefined ? (
                                            <span className="font-mono text-xs bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded border border-border-light dark:border-slate-700 text-text-secondary">
                                                {sensor.minThreshold} - {sensor.maxThreshold}
                                            </span>
                                        ) : <span className="text-text-muted">-</span>}
                                    </td>
                                    <td className="table-cell">
                                        <span className={`badge ${sensor.status === 'Enabled' ? 'badge-success' : 'badge-neutral'}`}>
                                            {sensor.status}
                                        </span>
                                    </td>
                                    <td className="table-cell text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(sensor)}
                                                className="p-1.5 text-text-muted hover:text-primary transition-colors"
                                                title="Edit Sensor"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sensor._id)}
                                                className="p-1.5 text-text-muted hover:text-error transition-colors"
                                                title="Delete Sensor"
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
                                                <FaWifi />
                                            </div>
                                            <h3 className="empty-state-title">No Sensors Active</h3>
                                            <p className="empty-state-desc">Connect sensors to start monitoring your field conditions.</p>
                                            <Button onClick={() => handleOpenModal()} icon={FaPlus}>
                                                Add Your First Sensor
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>


            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete"
            >
                <div className="space-y-4">
                    <p className="text-text-secondary">Are you sure you want to delete this sensor? This action cannot be undone.</p>
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
                            Delete Sensor
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editId ? 'Edit Sensor' : 'Add New Sensor'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Sensor ID</label>
                            <select
                                name="sensorId"
                                required
                                className="form-input"
                                value={formData.sensorId}
                                onChange={handleChange}
                                disabled={!!editId} // Disable ID edit typically
                            >
                                <option value="" disabled>Select Sensor ID</option>
                                {[...Array(20)].map((_, i) => (
                                    <option key={i} value={`SN-00${i + 1}`}>SN-00{i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Sensor Type</label>
                            <select
                                name="type"
                                className="form-input"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option value="Moisture">Moisture</option>
                                <option value="Temperature">Temperature</option>
                                <option value="Humidity">Humidity</option>
                                <option value="Light">Light</option>
                                <option value="pH Level">pH Level</option>
                                <option value="CO2">CO2</option>
                                <option value="Motion">Motion</option>
                                <option value="Pressure">Pressure</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Assigned Field</label>
                            <select
                                name="assignedField"
                                className="form-input"
                                value={formData.assignedField}
                                onChange={handleChange}
                            >
                                <option value="">-- Select Field --</option>
                                {fields.map(field => (
                                    <option key={field._id} value={field._id}>{field.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                className="form-input"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Enabled">Enabled</option>
                                <option value="Disabled">Disabled</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Min Threshold</label>
                            <input
                                type="number"
                                name="minThreshold"
                                className="form-input"
                                placeholder="0"
                                value={formData.minThreshold}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Max Threshold</label>
                            <input
                                type="number"
                                name="maxThreshold"
                                className="form-input"
                                placeholder="100"
                                value={formData.maxThreshold}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border-light">
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {editId ? 'Update Sensor' : 'Create Sensor'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div >
    );
};

export default Sensors;
