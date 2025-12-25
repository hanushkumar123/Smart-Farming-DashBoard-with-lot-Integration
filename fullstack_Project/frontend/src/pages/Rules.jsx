import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaRandom } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';

import { useAuth } from '../context/AuthContext';

const Rules = () => {
    const { user } = useAuth();
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        conditionField: 'soilMoisture',
        operator: '<',
        conditionValue: '',
        action: 'Start Irrigation',
        duration: '',
        mode: 'Auto',
        status: 'Active'
    });
    const [editId, setEditId] = useState(null);

    const fetchRules = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const res = await axios.get('/api/rules', config);
            setRules(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load rules');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRules();
        }
    }, [user]);

    const resetForm = () => {
        setFormData({
            name: '',
            conditionField: 'soilMoisture',
            operator: '<',
            conditionValue: '',
            action: 'Start Irrigation',
            duration: '',
            mode: 'Auto',
            status: 'Active'
        });
        setEditId(null);
    };

    const handleOpenModal = (rule = null) => {
        if (rule) {
            setFormData(rule);
            setEditId(rule._id);
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
            if (editId) {
                await axios.put(`/api/rules/${editId}`, formData, config);
                toast.success('Rule updated');
            } else {
                await axios.post('/api/rules', formData, config);
                toast.success('Rule created');
            }
            fetchRules();
            handleCloseModal();
        } catch (error) {
            console.error(error);
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this rule?')) {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            try {
                await axios.delete(`/api/rules/${id}`, config);
                toast.success('Rule deleted');
                fetchRules();
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete rule');
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading rules...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Automation Rules</h1>
                    <p className="text-slate-500 text-sm mt-1">Configure automated actions based on sensor data</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn btn-primary">
                    <FaPlus className="text-sm" /> Create New Rule
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rules.map((rule) => (
                    <div key={rule._id} className="card relative hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <FaRandom className="text-slate-400 text-xs" />
                                {rule.name}
                            </h3>
                            <span className={`badge ${rule.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                                {rule.status}
                            </span>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                <span className="font-semibold text-slate-700">IF: </span>
                                <span className="text-slate-600">{rule.conditionField} {rule.operator} {rule.conditionValue}</span>
                            </div>
                            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                                <span className="font-semibold text-emerald-800">THEN: </span>
                                <span className="text-emerald-700">{rule.action}</span>
                                {rule.duration && <span className="text-emerald-600 text-xs ml-2">({rule.duration} mins)</span>}
                            </div>
                            <div className="flex justify-between items-center text-slate-500 text-xs mt-2">
                                <span>Mode: {rule.mode}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(rule)} className="text-slate-400 hover:text-emerald-600 p-1.5 transition-colors" title="Edit Rule">
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(rule._id)} className="text-slate-400 hover:text-red-500 p-1.5 transition-colors" title="Delete Rule">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}

                {rules.length === 0 && (
                    <div className="col-span-full">
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <FaRandom />
                            </div>
                            <h3 className="empty-state-title">No Automation Rules</h3>
                            <p className="empty-state-desc">Set up rules to automatically manage irrigation, fans, and alerts.</p>
                            <button onClick={() => handleOpenModal()} className="btn btn-primary">
                                <FaPlus className="text-sm" /> Create Your First Rule
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editId ? 'Edit Rule' : 'New Rule'}>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group col-span-2">
                            <label className="form-label">Rule Name</label>
                            <select
                                name="name"
                                required
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Select Rule Name</option>
                                <option value="Moisture Control">Moisture Control</option>
                                <option value="High Temp Alert">High Temp Alert</option>
                                <option value="Freeze Protection">Freeze Protection</option>
                                <option value="Storm Protocol">Storm Protocol</option>
                                <option value="Humidity Balance">Humidity Balance</option>
                                <option value="CO2 Optimization">CO2 Optimization</option>
                                <option value="Light Schedule">Light Schedule</option>
                                <option value="Emergency Shutoff">Emergency Shutoff</option>
                                <option value="Pest Prevention">Pest Prevention</option>
                                <option value="Standard Irrigation">Standard Irrigation</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Condition Field</label>
                            <select name="conditionField" className="form-input" value={formData.conditionField} onChange={handleChange}>
                                <option value="soilMoisture">Soil Moisture</option>
                                <option value="temperature">Temperature</option>
                                <option value="humidity">Humidity</option>
                                <option value="lightLevel">Light Level</option>
                                <option value="phLevel">pH Level</option>
                                <option value="co2Level">CO2 Level</option>
                                <option value="windSpeed">Wind Speed</option>
                                <option value="rainDetected">Rain Detect</option>
                                <option value="batteryLevel">Battery Level</option>
                            </select>
                        </div>

                        <div className="form-group grid grid-cols-2 gap-2">
                            <div>
                                <label className="form-label">Operator</label>
                                <select name="operator" className="form-input" value={formData.operator} onChange={handleChange}>
                                    <option value="<">&lt;</option>
                                    <option value=">">&gt;</option>
                                    <option value="=">=</option>
                                    <option value="<=">&lt;=</option>
                                    <option value=">=">&gt;=</option>
                                    <option value="!=">!=</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Value</label>
                                <input type="number" name="conditionValue" className="form-input" required value={formData.conditionValue} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Action</label>
                            <select name="action" className="form-input" value={formData.action} onChange={handleChange}>
                                <option value="Start Irrigation">Start Irrigation</option>
                                <option value="Stop Irrigation">Stop Irrigation</option>
                                <option value="Send Alert">Send Alert</option>
                                <option value="Open Vents">Open Greenhouse Vents</option>
                                <option value="Close Vents">Close Greenhouse Vents</option>
                                <option value="Turn On Heater">Turn On Heater</option>
                                <option value="Turn Off Heater">Turn Off Heater</option>
                                <option value="Activate Fan">Activate Ventilation Fan</option>
                                <option value="Turn On Lights">Turn On Grow Lights</option>
                                <option value="Turn Off Lights">Turn Off Grow Lights</option>
                                <option value="Send Email">Send Email Notification</option>
                                <option value="Emergency Stop">Emergency System Stop</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Duration (Mins)</label>
                            <input type="number" name="duration" className="form-input" value={formData.duration} onChange={handleChange} placeholder="Optional" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mode</label>
                            <select name="mode" className="form-input" value={formData.mode} onChange={handleChange}>
                                <option value="Auto">Auto</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select name="status" className="form-input" value={formData.status} onChange={handleChange}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                        <button type="button" onClick={handleCloseModal} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">{editId ? 'Update Rule' : 'Create Rule'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Rules;
