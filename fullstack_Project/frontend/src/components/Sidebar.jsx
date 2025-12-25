import { Link, useLocation } from 'react-router-dom';
import { FaMapMarkedAlt, FaWifi, FaClipboardList, FaDatabase, FaCogs, FaLeaf, FaHome, FaUserShield, FaWarehouse, FaFileCode } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen = true }) => {
    const { user } = useAuth();
    console.log('Sidebar rendering user:', user);
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', name: 'Overview', icon: <FaHome /> },
        ...(user?.role === 'admin' ? [{ path: '/users', name: 'Users', icon: <FaUserShield /> }] : []),
        { path: '/farms', name: 'Farms', icon: <FaWarehouse /> },
        { path: '/fields', name: 'Fields', icon: <FaMapMarkedAlt /> },
        { path: '/sensors', name: 'Sensors', icon: <FaWifi /> },
        { path: '/rules', name: 'Rules', icon: <FaClipboardList /> },
        { path: '/templates', name: 'Templates', icon: <FaFileCode /> },
        { path: '/data-logs', name: 'Data Logs', icon: <FaDatabase /> },
        { path: '/settings', name: 'Settings', icon: <FaCogs /> },
    ];

    return (
        <aside className={`${isOpen ? 'w-72' : 'w-20'} bg-white border-r border-border-light flex-shrink-0 flex flex-col transition-all duration-300 shadow-sm z-20 overflow-hidden`}>
            {/* Brand Header */}
            <div className={`h-16 flex items-center ${isOpen ? 'px-6' : 'justify-center'} bg-white border-b border-border-light transition-all duration-300`}>
                <FaLeaf className="text-primary text-xl flex-shrink-0" />
                <span className={`text-text-primary text-lg font-bold tracking-tight ml-3 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
                    Smart<span className="text-primary">Form</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                {isOpen && (
                    <div className="px-3 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider animate-fade-in">
                        Main Menu
                    </div>
                )}
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        title={!isOpen ? item.name : ''}
                        className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive(item.path)
                            ? 'bg-primary-light text-primary'
                            : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                            } ${!isOpen ? 'justify-center' : ''}`}
                    >
                        <span className={`text-lg transition-colors flex-shrink-0 ${isOpen ? 'mr-3' : ''} ${isActive(item.path) ? 'text-primary' : 'text-text-muted group-hover:text-[#0EA5A4]/70'}`}>
                            {item.icon}
                        </span>
                        <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
                            {item.name}
                        </span>
                    </Link>
                ))}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-border-light bg-gray-50/50">
                <div className={`flex items-center gap-3 ${!isOpen ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-[#0EA5A4]/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className={`transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
                        <p className="text-sm font-medium text-text-primary whitespace-nowrap">{user?.name || 'User'}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
