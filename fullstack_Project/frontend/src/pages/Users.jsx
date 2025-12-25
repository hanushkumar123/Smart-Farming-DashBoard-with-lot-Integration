import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUserShield, FaUserTimes, FaCheckCircle, FaBan } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const Users = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'operator',
        status: 'Active'
    });
    const [editId, setEditId] = useState(null);

    // Fetch Users
    const fetchUsers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${currentUser?.token}`,
                },
            };
            const res = await axios.get('/api/users', config);
            setUsers(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load users');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchUsers();
        }
    }, [currentUser]);

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', role: 'operator', status: 'Active' });
        setEditId(null);
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setFormData({ ...user, password: '' }); // Don't show password
            setEditId(user._id);
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
                // If password is empty, don't send it
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;

                await axios.put(`/api/users/${editId}`, updateData, config);
                toast.success('User updated successfully');
            } else {
                await axios.post('/api/users', formData, config);
                toast.success('User created successfully');
            }
            fetchUsers();
            handleCloseModal();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            const config = {
                headers: {
                    Authorization: `Bearer ${currentUser?.token}`,
                },
            };
            try {
                await axios.delete(`/api/users/${id}`, config);
                toast.success('User deleted');
                fetchUsers();
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete user');
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading users...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage system access and roles</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn btn-primary">
                    <FaPlus className="text-sm" /> Add User
                </button>
            </div>

            <div className="table-container">
                <div className="overflow-x-auto">
                    <table className="table-clean">
                        <thead className="table-header">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.length > 0 ? users.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="table-cell">
                                        <div>
                                            <div className="font-medium text-slate-900">{user.name}</div>
                                            <div className="text-slate-500 text-xs">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'admin'
                                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                : 'bg-slate-50 text-slate-700 border-slate-200'
                                            }`}>
                                            {user.role === 'admin' ? <FaUserShield className="text-[10px]" /> : <FaUserTimes className="text-[10px]" />}
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="table-cell">
                                        <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                                            {user.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="table-cell text-slate-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="table-cell text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(user)}
                                                className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
                                                title="Edit User"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                title="Delete User"
                                                disabled={currentUser?._id === user._id} // Prevent self-delete
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5">
                                        <div className="empty-state">
                                            <div className="empty-state-icon">
                                                <FaUserShield />
                                            </div>
                                            <h3 className="empty-state-title">No Users Found</h3>
                                            <p className="empty-state-desc">Get started by adding system users.</p>
                                            <button onClick={() => handleOpenModal()} className="btn btn-primary">
                                                <FaPlus className="text-sm" /> Add First User
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editId ? 'Edit User' : 'Add New User'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Password {editId && <span className="text-slate-400 font-normal text-xs ml-1">(Leave blank to keep current)</span>}
                            </label>
                            <input
                                type="password"
                                name="password"
                                required={!editId}
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select
                                    name="role"
                                    className="form-input"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="operator">Operator</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User (Legacy)</option>
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
                                    <option value="Active">Active</option>
                                    <option value="Disabled">Disabled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                        <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editId ? 'Update User' : 'Create User'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Users;
