import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCopy, FaFileCode, FaClipboardList } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const Templates = () => {
    const { user } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [activeTab, setActiveTab] = useState('Sensor Config');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Sensor Config',
        config: '', // JSON string for editing simplicity
        description: ''
    });
    const [editId, setEditId] = useState(null);

    // Fetch Templates
    const fetchTemplates = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const res = await axios.get('/api/templates', config);
            setTemplates(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load templates');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTemplates();
        }
    }, [user]);

    const resetForm = () => {
        setFormData({
            name: '',
            type: activeTab,
            config: '{\n  "key": "value"\n}',
            description: ''
        });
        setEditId(null);
    };

    const handleOpenModal = (template = null) => {
        if (template) {
            setFormData({
                ...template,
                config: JSON.stringify(template.config, null, 2)
            });
            setEditId(template._id);
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
        const configReq = {
            headers: {
                Authorization: `Bearer ${user?.token}`,
            },
        };

        try {
            // Parse JSON config
            let parsedConfig;
            try {
                parsedConfig = JSON.parse(formData.config);
            } catch (err) {
                toast.error('Invalid JSON format in Configuration');
                return;
            }

            const payload = { ...formData, config: parsedConfig };

            if (editId) {
                await axios.put(`/api/templates/${editId}`, payload, configReq);
                toast.success('Template updated');
            } else {
                await axios.post('/api/templates', payload, configReq);
                toast.success('Template created');
            }
            fetchTemplates();
            handleCloseModal();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user?.token}` }
                };
                await axios.delete(`/api/templates/${id}`, config);
                toast.success('Template deleted');
                fetchTemplates();
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete template');
            }
        }
    };

    const filteredTemplates = templates.filter(t => t.type === activeTab);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading templates...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Templates & Presets</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage reusable configurations</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn btn-primary">
                    <FaPlus className="text-sm" /> Create Template
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-slate-200 mb-6 overflow-x-auto pb-2">
                {['Sensor Config', 'Rule Preset', 'Field Layout', 'Alert Config', 'Report Setup', 'Task Chain', 'Other'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setFormData({ ...formData, type: tab }) }}
                        className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab
                            ? 'border-emerald-500 text-emerald-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.length > 0 ? filteredTemplates.map(template => (
                    <div key={template._id} className="card p-5 hover:shadow-md transition-shadow relative">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    {template.type === 'Sensor Config' ? <FaFileCode /> : <FaClipboardList />}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{template.name}</h3>
                                    <p className="text-xs text-slate-500">{new Date(template.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleOpenModal(template)}
                                    className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"
                                    title="Edit"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(template._id)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                    title="Delete"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
                            {template.description || "No description provided."}
                        </p>

                        <div className="bg-slate-50 p-3 rounded text-xs font-mono text-slate-700 overflow-hidden h-24 relative border border-slate-100">
                            <pre>{JSON.stringify(template.config, null, 2)}</pre>
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50 to-transparent"></div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <FaCopy className="mx-auto text-3xl mb-3 opacity-50" />
                        <p>No templates found for {activeTab}</p>
                        <button onClick={() => handleOpenModal()} className="mt-4 text-emerald-600 font-medium hover:underline">
                            Create a new {activeTab}
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editId ? 'Edit Template' : 'Create New Template'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="form-group">
                            <label className="form-label">Template Name</label>
                            <select
                                name="name"
                                required
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Select Template Name</option>
                                <option value="Standard Sensor Setup">Standard Sensor Setup</option>
                                <option value="High Precision Mode">High Precision Mode</option>
                                <option value="Battery Saver Profile">Battery Saver Profile</option>
                                <option value="Weekly Report">Weekly Report</option>
                                <option value="Critical Alert Chain">Critical Alert Chain</option>
                                <option value="Field Mapping Basic">Field Mapping Basic</option>
                                <option value="Custom Configuration">Custom Configuration</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select
                                name="type"
                                required
                                className="form-input"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option value="Sensor Config">Sensor Config</option>
                                <option value="Rule Preset">Rule Preset</option>
                                <option value="Field Layout">Field Layout</option>
                                <option value="Alert Config">Alert Config</option>
                                <option value="Report Setup">Report Setup</option>
                                <option value="Task Chain">Task Chain</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                className="form-input"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Briefly describe what this template does..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                        <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editId ? 'Update Template' : 'Save Template'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Templates;
