import React, { useState, useEffect } from 'react';
import { FaUser, FaBell, FaDatabase, FaSave } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        units: 'Metric',
        notifications: true,
        userName: '',
        email: '',
        darkMode: localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    });

    useEffect(() => {
        console.log('Settings: Dark Mode Effect triggered. Value:', settings.darkMode);
        if (settings.darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            console.log('Settings: Added class "dark" to html');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            console.log('Settings: Removed class "dark" from html');
        }
    }, [settings.darkMode]);

    useEffect(() => {
        if (user) {
            setSettings(prev => ({
                ...prev,
                userName: user.name || 'User',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        console.log(`Settings: handleChange for ${e.target.name}. New value:`, value);
        setSettings({ ...settings, [e.target.name]: value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const payload = {
                name: settings.userName,
                email: settings.email,
                // Assuming other settings might be saved to user profile or separate endpoint
            };

            const res = await axios.put('/api/users/profile', payload, config);

            // Optionally update local storage if user details changed
            if (res.data) {
                const updatedUser = { ...user, name: res.data.name, email: res.data.email };
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                // In a real app we'd update the context here, but a reload works for now or just toast
            }

            toast.success('Profile updated successfully');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleReset = () => {
        if (window.confirm('Reset all settings to default?')) {
            setSettings({
                units: 'Metric',
                notifications: true,
                userName: user?.name || 'User',
                email: user?.email || '',
                darkMode: false
            });
            toast.info('Settings reset to defaults');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
                <p className="text-text-secondary text-sm mt-1">Configure application preferences.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* General Settings */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <FaDatabase className="text-text-muted" /> General
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                            <label className="form-label">Units</label>
                            <select name="units" className="form-input" value={settings.units} onChange={handleChange}>
                                <option value="Metric">Metric (Celsius, Hectares)</option>
                                <option value="Imperial">Imperial (Fahrenheit, Acres)</option>
                            </select>
                        </div>
                        <div className="form-group flex items-center gap-3 pt-6">
                            <input
                                type="checkbox"
                                name="darkMode"
                                id="dark-mode-toggle"
                                className="w-5 h-5 text-primary rounded focus:ring-primary border-border-soft"
                                checked={settings.darkMode}
                                onChange={handleChange}
                            />
                            <label htmlFor="dark-mode-toggle" className="text-text-primary font-medium cursor-pointer select-none">
                                Dark Mode
                            </label>
                        </div>
                        <div className="form-group flex items-center gap-3 pt-6">
                            <input
                                type="checkbox"
                                name="notifications"
                                id="notif-toggle"
                                className="w-5 h-5 text-primary rounded focus:ring-primary border-border-soft"
                                checked={settings.notifications}
                                onChange={handleChange}
                            />
                            <label htmlFor="notif-toggle" className="text-text-primary font-medium cursor-pointer select-none">
                                Enable System Notifications
                            </label>
                        </div>
                    </div>
                </div>

                {/* Profile Settings */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <FaUser className="text-text-muted" /> User Profile
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                            <label className="form-label">Display Name</label>
                            <input type="text" name="userName" className="form-input" value={settings.userName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" name="email" className="form-input" value={settings.email} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                    <button type="button" onClick={handleReset} className="btn hover:text-red-600 hover:bg-red-50 text-text-secondary">
                        Reset Defaults
                    </button>
                    <button type="submit" className="btn btn-primary">
                        <FaSave /> Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
