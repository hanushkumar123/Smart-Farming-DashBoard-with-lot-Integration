import React, { useState } from 'react';
import {
    FaTint,
    FaThermometerHalf,
    FaSun,
    FaExclamationTriangle,
    FaSeedling,
    FaWater,
    FaWifi,
    FaMapMarkedAlt
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Components
import Card from '../components/Card';
import Button from '../components/Button';

// Fix Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Dashboard = () => {
    const navigate = useNavigate();
    // Refresh Logic
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Metrics State
    const [metrics, setMetrics] = useState({
        moisture: 47,
        temp: 24.8,
        humidity: 44.7,
        light: 426
    });

    // Chart Data State
    const generateInitialData = () => {
        const data = [];
        const now = new Date();
        for (let i = 9; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60000);
            data.push({
                time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                moisture: Math.floor(Math.random() * (60 - 30) + 30),
                temp: parseFloat((Math.random() * (30 - 20) + 20).toFixed(1))
            });
        }
        return data;
    };

    const [trendsData, setTrendsData] = useState(generateInitialData());

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate API call and data update
        setTimeout(() => {
            // Randomize Metrics
            setMetrics({
                moisture: Math.floor(Math.random() * (60 - 30) + 30),
                temp: parseFloat((Math.random() * (30 - 20) + 20).toFixed(1)),
                humidity: parseFloat((Math.random() * (60 - 40) + 40).toFixed(1)),
                light: Math.floor(Math.random() * (800 - 200) + 200)
            });

            // Randomize Chart Data (Last point)
            const newData = [...trendsData];
            const lastTime = new Date();
            const timeString = lastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            newData.shift(); // Remove oldest
            newData.push({
                time: timeString,
                moisture: Math.floor(Math.random() * 100),
                temp: parseFloat((Math.random() * 35).toFixed(1))
            });
            setTrendsData(newData);

            setIsRefreshing(false);
            toast.success('Analysis refreshed successfully');
        }, 1500);
    };

    const connectedAssets = [
        { id: 1, name: 'Main Irrigation Node', type: 'Irrigation', health: 'Online', power: 85, updated: '2m ago' },
        { id: 2, name: 'Field Sensor A', type: 'Sensor', health: 'Online', power: 92, updated: '2m ago' },
        { id: 3, name: 'Drone Dock', type: 'Machinery', health: 'Charging', power: 45, updated: '2m ago' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="h1">Overview</h1>
                <p className="body-text">Real-time farm monitoring.</p>
            </div>

            {/* Alert Banner - Minimalist */}
            <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-white font-medium">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        System Health: --%
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 font-medium">
                        <FaSeedling /> Crop Stress: Low
                    </div>
                    <div className="flex items-center gap-2 text-blue-400 font-medium">
                        <FaWater /> Irrigation: Auto-Mode
                    </div>
                </div>
                <div className="bg-red-600/90 text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-2">
                    591 Alerts Pending
                </div>
            </div>

            {/* Critical Status Card */}
            <Card className="border-orange-200 dark:border-orange-900/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h4 className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">Daily Insight</h4>
                        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                            Farm Status: <span className="text-orange-500">Critical (0%)</span>
                        </h2>
                        <p className="text-text-secondary mt-1 flex items-center gap-2 text-sm">
                            <FaExclamationTriangle className="text-orange-400" /> Multiple alerts require attention.
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleRefresh}
                        isLoading={isRefreshing}
                    >
                        {isRefreshing ? 'Analyzing...' : 'Refresh Analysis'}
                    </Button>
                </div>
            </Card>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Moisture */}
                <Card className="flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Soil Moisture</div>
                            <FaTint className="text-blue-100 dark:text-blue-900/50 text-2xl" />
                        </div>
                        <div className="mt-3">
                            <span className="text-3xl font-bold text-text-primary">{metrics.moisture}</span>
                            <span className="text-text-muted text-lg ml-1">%</span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-xs font-medium">
                        <span className="badge badge-success">OPTIMAL</span>
                        <span className="text-emerald-600 dark:text-emerald-400">↑ +2% (1h)</span>
                    </div>
                </Card>

                {/* Temperature */}
                <Card className="flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Temperature</div>
                            <FaThermometerHalf className="text-red-100 dark:text-red-900/50 text-2xl" />
                        </div>
                        <div className="mt-3">
                            <span className="text-3xl font-bold text-text-primary">{metrics.temp}</span>
                            <span className="text-text-muted text-lg ml-1">°C</span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-xs font-medium">
                        <span className="badge badge-success">OPTIMAL</span>
                        <span className="text-emerald-600 dark:text-emerald-400">↓ -0.5°C (1h)</span>
                    </div>
                </Card>

                {/* Humidity */}
                <Card className="flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Humidity</div>
                            <FaTint className="text-slate-200 dark:text-slate-700 text-2xl" />
                        </div>
                        <div className="mt-3">
                            <span className="text-3xl font-bold text-text-primary">{metrics.humidity}</span>
                            <span className="text-text-muted text-lg ml-1">%</span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-xs font-medium">
                        <span className="badge badge-neutral">NORMAL</span>
                        <span className="text-emerald-600 dark:text-emerald-400">Stable</span>
                    </div>
                </Card>

                {/* Light */}
                <Card className="flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <div className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">Light Intensity</div>
                            <FaSun className="text-amber-100 dark:text-amber-900/50 text-2xl" />
                        </div>
                        <div className="mt-3">
                            <span className="text-3xl font-bold text-text-primary">{metrics.light}</span>
                            <span className="text-text-muted text-lg ml-1">lx</span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-xs font-medium">
                        <span className="badge bg-bg-card border border-border-light text-text-secondary">NORMAL</span>
                        <span className="text-emerald-600 dark:text-emerald-400">Daylight</span>
                    </div>
                </Card>
            </div>

            {/* Map and Charts Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                {/* Map Section */}
                <div className="lg:col-span-2 card p-0 overflow-hidden flex flex-col border border-border-light shadow-sm bg-bg-card">
                    <div className="p-4 border-b border-border-light flex justify-between items-center bg-bg-card z-10">
                        <h3 className="font-bold text-text-primary flex items-center gap-2">
                            <FaMapMarkedAlt className="text-text-muted" /> Field Status
                        </h3>
                        <span className="text-xs font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded flex items-center gap-1 border border-emerald-100 dark:border-emerald-800">
                            <FaWifi /> LIVE NETWORK
                        </span>
                    </div>
                    <div className="flex-1 relative z-0">
                        <MapContainer
                            center={[26.8467, 80.9462]}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            <Marker position={[26.8467, 80.9462]}>
                                <Popup>
                                    Main Hub <br /> Status: Online
                                </Popup>
                            </Marker>
                            <Marker position={[26.8500, 80.9500]}>
                                <Popup>
                                    Sensor Node A <br /> Moisture: 47%
                                </Popup>
                            </Marker>
                        </MapContainer>

                        {/* Legend Overlay */}
                        <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border border-border-light z-[1000] text-xs">
                            <h4 className="font-bold text-text-secondary mb-2">LEGEND</h4>
                            <div className="space-y-1 text-text-secondary">
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Active Sensor</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Warning/Charging</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Offline</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Trends Chart */}
                <Card className="flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-text-primary flex items-center gap-2">
                            LIVE TRENDS
                        </h3>
                        <span className="text-xs bg-gray-100 dark:bg-slate-800 text-text-secondary px-2 py-1 rounded">LAST 10 READINGS</span>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                                <XAxis dataKey="time" hide />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Line type="monotone" dataKey="moisture" stroke="#0ea5a4" strokeWidth={2} dot={{ r: 3, fill: '#0ea5a4', strokeWidth: 2, stroke: '#fff' }} name="Moisture" />
                                <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={false} name="Temp" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4 text-xs font-medium">
                        <div className="flex items-center gap-1 text-primary">
                            <div className="w-2 h-2 rounded-full bg-primary"></div> Moisture
                        </div>
                        <div className="flex items-center gap-1 text-warning">
                            <div className="w-2 h-2 rounded-full bg-warning"></div> Temp
                        </div>
                    </div>
                </Card>
            </div>

            {/* Connected Assets List */}
            <Card
                title="Connected Assets"
                actions={
                    <Button variant="ghost" size="sm" onClick={() => navigate('/sensors')} className="text-primary font-bold">
                        VIEW ALL SENSORS
                    </Button>
                }
            >
                <div className="overflow-x-auto -mx-6">
                    <table className="table-clean">
                        <thead className="table-header bg-gray-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3">Device</th>
                                <th className="px-6 py-3">Health</th>
                                <th className="px-6 py-3">Power</th>
                                <th className="px-6 py-3 text-right">Activity</th>
                            </tr>
                        </thead>
                        <tbody className="bg-bg-card">
                            {connectedAssets.map(asset => (
                                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors border-b border-border-light last:border-0">
                                    <td className="table-cell font-medium text-text-primary flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-gray-50 dark:bg-slate-800 text-text-muted border border-border-light">
                                            <FaWifi />
                                        </div>
                                        {asset.name}
                                    </td>
                                    <td className="table-cell">
                                        <span className={`badge ${asset.health === 'Online' ? 'badge-success' :
                                            asset.health === 'Charging' ? 'badge-warning' : 'badge-neutral'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${asset.health === 'Online' ? 'bg-current' :
                                                asset.health === 'Charging' ? 'bg-current' : 'bg-slate-400'
                                                }`}></div>
                                            {asset.health}
                                        </span>
                                    </td>
                                    <td className="table-cell w-1/4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${asset.power > 50 ? 'bg-slate-500 dark:bg-slate-400' : 'bg-red-400'}`}
                                                    style={{ width: `${asset.power}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-text-muted w-8">{asset.power}%</span>
                                        </div>
                                    </td>
                                    <td className="table-cell text-right text-text-muted text-xs">
                                        Updated {asset.updated}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
