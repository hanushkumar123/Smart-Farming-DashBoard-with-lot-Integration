import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock, FaArrowRight, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        const res = await resetPassword(token, password);
        setIsLoading(false);

        if (res.success) {
            toast.success('Password reset successfully! Please login.');
            navigate('/login');
        } else {
            toast.error(res.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Enter your new password below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 ml-1">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <FaLock />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-xl text-sm shadow-sm placeholder-slate-400 focus:outline-none transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 ml-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <FaLock />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-xl text-sm shadow-sm placeholder-slate-400 focus:outline-none transition-all"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full btn-primary h-12 flex justify-center items-center gap-2 group relative overflow-hidden ${isLoading ? 'opacity-80 cursor-wait' : 'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30'}`}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin text-emerald-100" />
                                    <span className="text-emerald-50 font-semibold">Resetting...</span>
                                </>
                            ) : (
                                <>
                                    <span className="font-bold tracking-wide">Reset Password</span>
                                    <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
