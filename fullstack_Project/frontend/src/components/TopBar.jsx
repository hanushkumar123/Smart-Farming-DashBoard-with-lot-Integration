import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaBars, FaSearch, FaBell } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const TopBar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute
    useState(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Generate basic breadcrumb title
    const getPageTitle = () => {
        const path = location.pathname.split('/')[1];
        if (!path) return 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <header className="h-16 bg-white border-b border-border-light flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm">
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleSidebar}
                    className="text-text-secondary hover:text-text-primary focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <FaBars />
                </button>

                <h2 className="text-lg font-bold text-text-primary tracking-tight flex items-center gap-2 border-r border-border-light pr-6 mr-2">
                    {getPageTitle()}
                </h2>

                {/* Field Selector (Enterprise Feature) */}
                <div className="hidden md:flex items-center gap-2">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Field:</span>
                    <select className="bg-gray-50 border border-border-light text-text-secondary text-sm rounded-lg focus:ring-primary focus:border-primary block p-1.5 outline-none cursor-pointer hover:bg-gray-100 transition-colors">
                        <option>Alpha Sector (North)</option>
                        <option>Greenhouse B</option>
                        <option>Orchard Zone C</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Search - Hidden on mobile */}
                <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-1.5 w-64 border border-transparent focus-within:border-[#0EA5A4]/50 focus-within:bg-white transition-all">
                    <FaSearch className="text-text-muted text-sm" />
                    <input
                        type="text"
                        placeholder="Search assets, sensors..."
                        className="bg-transparent border-none focus:ring-0 text-sm text-text-secondary ml-2 w-full placeholder:text-text-muted focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
                    {/* Date & Time Widget */}
                    <div className="hidden lg:block text-right">
                        <p className="text-xs font-bold text-slate-700">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    </div>

                    <button className="relative text-slate-500 hover:text-emerald-600 transition-colors p-1.5 hover:bg-emerald-50 rounded-full">
                        <FaBell className="text-lg" />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse border border-white"></span>
                    </button>

                    <div className="flex items-center gap-3 pl-2">
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 focus:outline-none group"
                            >
                                <FaUserCircle className="text-3xl text-emerald-600/80 group-hover:text-emerald-600 transition-colors shadow-sm rounded-full" />
                                <div className="text-left hidden md:block">
                                    <p className="text-xs font-bold text-slate-700 leading-none group-hover:text-emerald-700">{user?.name || 'User'}</p>
                                </div>
                            </button>

                            {/* Dropdown menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-fade-in origin-top-right">
                                    <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                                        <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            logout();
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                                    >
                                        <FaSignOutAlt /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
