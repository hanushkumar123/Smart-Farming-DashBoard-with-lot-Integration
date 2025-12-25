import React, { useState, useEffect } from 'react';
import { FaDownload, FaHistory, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';

import { useAuth } from '../context/AuthContext';

const DataLogs = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        actionType: '',
        entity: ''
    });

    // Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
                params: {
                    search: filters.search,
                    actionType: filters.actionType,
                    entity: filters.entity
                }
            };
            const res = await axios.get('/api/logs', config);
            setLogs(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            const delayDebounceFn = setTimeout(() => {
                fetchLogs();
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [user, filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            await axios.delete(`/api/logs/${deleteId}`, config);
            toast.success('Log entry deleted');
            fetchLogs();
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete log entry');
        }
    };

    const exportCSV = () => {
        const headers = ['Timestamp', 'Action Type', 'Entity', 'User', 'Description'];
        const csvContent = [
            headers.join(','),
            ...logs.map(log => [
                new Date(log.timestamp).toISOString(),
                log.actionType,
                log.entity,
                log.user,
                `"${log.description || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `system_logs_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    if (loading) return <div className="p-8 text-center text-text-muted">Loading logs...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="h1">System Logs</h1>
                    <p className="body-text">Audit trail of system activities and user actions</p>
                </div>
                <Button onClick={exportCSV} variant="secondary" icon={FaDownload}>
                    Export CSV
                </Button>
            </div>

            {/* Filter Bar */}
            <Card className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search description..."
                        className="form-input"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="w-40">
                    <select
                        name="actionType"
                        className="form-input"
                        value={filters.actionType}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Actions</option>
                        <option value="Create">Create</option>
                        <option value="Update">Update</option>
                        <option value="Delete">Delete</option>
                        <option value="System">System</option>
                    </select>
                </div>
                <div className="w-40">
                    <select
                        name="entity"
                        className="form-input"
                        value={filters.entity}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Entities</option>
                        <option value="User">User</option>
                        <option value="Farm">Farm</option>
                        <option value="Field">Field</option>
                        <option value="Sensor">Sensor</option>
                        <option value="Template">Template</option>
                    </select>
                </div>
            </Card>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto -mx-6">
                    <table className="table-clean">
                        <thead className="table-header">
                            <tr>
                                <th className="px-6 py-3 text-left">Timestamp</th>
                                <th className="px-6 py-3 text-left">Action Type</th>
                                <th className="px-6 py-3 text-left">Entity</th>
                                <th className="px-6 py-3 text-left">User</th>
                                <th className="px-6 py-3 text-left">Description</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light bg-bg-card">
                            {logs.length > 0 ? logs.map((log) => (
                                <tr key={log._id} className="hover:bg-primary-light/30 dark:hover:bg-primary-dark/20 transition-colors">
                                    <td className="table-cell text-text-muted text-xs font-mono">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="table-cell">
                                        <span className={`badge ${log.actionType === 'Create' ? 'badge-success' :
                                            log.actionType === 'Delete' ? 'badge-danger' :
                                                'badge-neutral'
                                            }`}>
                                            {log.actionType}
                                        </span>
                                    </td>
                                    <td className="table-cell font-medium text-text-primary">{log.entity}</td>
                                    <td className="table-cell text-text-secondary">{log.user}</td>
                                    <td className="table-cell text-text-secondary italic max-w-md truncate">
                                        {log.description || '-'}
                                    </td>
                                    <td className="table-cell text-right">
                                        <button
                                            onClick={() => handleDeleteClick(log._id)}
                                            className="p-1.5 text-text-muted hover:text-error transition-colors"
                                            title="Delete Log"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6">
                                        <div className="empty-state">
                                            <div className="empty-state-icon">
                                                <FaHistory />
                                            </div>
                                            <h3 className="empty-state-title">No Logs Found</h3>
                                            <p className="empty-state-desc">System activities will appear here once actions are performed.</p>
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
                title="Confirm Log Deletion"
            >
                <div className="space-y-4">
                    <p className="text-text-secondary">Are you sure you want to delete this log entry? This operation is permanent.</p>
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
                            Delete Log
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DataLogs;
