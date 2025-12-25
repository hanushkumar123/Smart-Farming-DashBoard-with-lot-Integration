import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Farms from './pages/Farms';
import Fields from './pages/Fields';
import Sensors from './pages/Sensors';
import Rules from './pages/Rules';
import Templates from './pages/Templates';
import DataLogs from './pages/DataLogs';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="users" element={<Users />} />
                        <Route path="farms" element={<Farms />} />
                        <Route path="fields" element={<Fields />} />
                        <Route path="sensors" element={<Sensors />} />
                        <Route path="rules" element={<Rules />} />
                        <Route path="templates" element={<Templates />} />
                        <Route path="data-logs" element={<DataLogs />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
