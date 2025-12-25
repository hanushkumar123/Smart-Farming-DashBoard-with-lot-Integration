import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLeaf, FaUser, FaLock, FaEnvelope, FaArrowRight, FaSeedling, FaShieldAlt, FaCloud, FaCheckCircle, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const { login, register, forgotPassword } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Validation Logic
    const validateField = (name, value) => {
        let error = '';
        if (name === 'email') {
            if (!value) error = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email address';
        }
        if (!isForgotPassword && name === 'password') {
            if (!value) error = 'Password is required';
            else if (value.length < 6) error = 'Password must be at least 6 characters';
        }
        if (!isForgotPassword && name === 'name' && !isLogin) {
            if (!value) error = 'Full Name is required';
        }
        return error;
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (touched[name]) {
            setErrors({ ...errors, [name]: validateField(name, value) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const newErrors = {};
        if (isForgotPassword) {
            newErrors.email = validateField('email', formData.email);
        } else {
            Object.keys(formData).forEach(key => {
                if (isLogin && key === 'name') return;
                newErrors[key] = validateField(key, formData[key]);
            });
        }

        setErrors(newErrors);
        setTouched({ name: true, email: true, password: true });

        if (Object.values(newErrors).some(err => err)) return;

        setIsLoading(true);
        let res;
        try {
            // Emulate slight delay for "Processing" feel if API is too fast
            await new Promise(r => setTimeout(r, 600));
            if (isForgotPassword) {
                res = await forgotPassword(formData.email);
            } else if (isLogin) {
                res = await login(formData.email, formData.password);
            } else {
                res = await register(formData.name, formData.email, formData.password);
            }

            if (res.success) {
                if (isForgotPassword) {
                    toast.success('Password reset link sent! Check your email (console).');
                    setIsForgotPassword(false);
                    setIsLogin(true);
                } else {
                    toast.success(isLogin ? 'Welcome back! Redirecting...' : 'Account created! Redirecting...');
                    navigate('/dashboard');
                }
            } else {
                toast.error(res.error);
            }
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* Left Side: Brand Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-slate-900 overflow-hidden">
                <div className="relative z-10 animate-fade-in duration-700">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/20 p-2.5 rounded-xl backdrop-blur-sm border border-emerald-500/10 shadow-lg shadow-emerald-900/20">
                            <FaLeaf className="text-2xl text-emerald-400" />
                        </div>
                        <span className="text-white text-xl font-bold tracking-tight">Smart<span className="text-emerald-400">Form</span></span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg mb-10 animate-fade-in duration-1000 delay-100">
                    <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-sm">
                        Smart Farming <br />
                        <span className="text-gradient">Reimagined.</span>
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed mb-10 font-light max-w-md">
                        Monitor field conditions, automate irrigation, and maximize crop yields with our enterprise-grade IoT platform.
                    </p>

                    {/* Feature Card */}
                    <div className="flex items-center gap-6 p-6 bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-900/20 group cursor-default">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors shadow-inner">
                                <FaSeedling className="text-xl" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-slate-100 font-bold text-sm tracking-wide">Real-time IO</span>
                                <span className="text-slate-400 text-xs font-medium">Sensor Networks</span>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-slate-700/50"></div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:border-blue-500/40 transition-colors shadow-inner">
                                <FaLeaf className="text-xl" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-slate-100 font-bold text-sm tracking-wide">Yield Analytics</span>
                                <span className="text-slate-400 text-xs font-medium">AI Forecasting</span>
                            </div>
                        </div>
                    </div>

                    {/* Trust Signals */}
                    <div className="mt-8 flex items-center gap-6 opacity-60 text-xs font-medium text-slate-400">
                        <span className="flex items-center gap-1.5"><FaShieldAlt /> Secure Login</span>
                        <span className="flex items-center gap-1.5"><FaCloud /> Cloud Platform</span>
                        <span className="flex items-center gap-1.5"><FaCheckCircle /> Enterprise Ready</span>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-slate-500 font-medium tracking-wide animate-fade-in delay-300">
                    &copy; 2025 SmartAgri Solutions. Be Kind.
                </div>

                {/* Background Pattern & Depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-900 z-0"></div>

                {/* Subtle Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                {/* Glow Orbs */}
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute top-1/2 -right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-[80px]"></div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-slate-50 relative">
                <div className="mx-auto w-full max-w-sm lg:max-w-md animate-slide-up-fade">
                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome back' : 'Start your journey')}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            {isForgotPassword
                                ? 'Enter your email to receive a reset token.'
                                : (isLogin ? 'Enter your credentials to access the dashboard.' : 'Join 2,000+ farmers optimizing their yield.')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {!isLogin && !isForgotPassword && (
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                                <div className="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-0.5">
                                    <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300 ${errors.name ? 'text-red-400' : 'text-slate-400 group-focus-within:text-emerald-500'}`}>
                                        <FaUser />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className={`w-full pl-11 pr-4 py-2.5 bg-white border ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'} rounded-xl text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 hover:border-slate-300`}
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                                {errors.name && <p className="mt-1 ml-1 text-xs text-red-500 font-medium animate-fade-in">{errors.name}</p>}
                            </div>
                        )}

                        <div className="group">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                            <div className="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-0.5">
                                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300 ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-emerald-500'}`}>
                                    <FaEnvelope />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className={`w-full pl-11 pr-4 py-2.5 bg-white border ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'} rounded-xl text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 hover:border-slate-300`}
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                            {errors.email && <p className="mt-1 ml-1 text-xs text-red-500 font-medium animate-fade-in">{errors.email}</p>}
                        </div>

                        {!isForgotPassword && (
                            <div className="group">
                                <div className="flex justify-between items-center mb-1.5 ml-1">
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                                    {isLogin && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsForgotPassword(true);
                                                setErrors({});
                                            }}
                                            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors tab-focus"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-0.5">
                                    <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300 ${errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-emerald-500'}`}>
                                        <FaLock />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        className={`w-full pl-11 pr-10 py-2.5 bg-white border ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'} rounded-xl text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 hover:border-slate-300`}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 ml-1 text-xs text-red-500 font-medium animate-fade-in">{errors.password}</p>}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full btn-primary h-12 flex justify-center items-center gap-2 group relative overflow-hidden ${isLoading ? 'opacity-80 cursor-wait' : 'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30'}`}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin text-emerald-100" />
                                    <span className="text-emerald-50 font-semibold">Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span className="font-bold tracking-wide">
                                        {isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account')}
                                    </span>
                                    <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm">
                        {isForgotPassword ? (
                            <button
                                onClick={() => {
                                    setIsForgotPassword(false);
                                    setErrors({});
                                }}
                                className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded px-1"
                            >
                                Back to Login
                            </button>
                        ) : (
                            <>
                                <span className="text-slate-500">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                                </span>
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setErrors({});
                                        setTouched({});
                                    }}
                                    className="ml-2 font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded px-1"
                                >
                                    {isLogin ? "Sign up" : "Sign in"}
                                </button>
                            </>
                        )}
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-2">
                            &copy; 2025 SmartAgri · <FaShieldAlt className="text-xs" /> Secure Access
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
