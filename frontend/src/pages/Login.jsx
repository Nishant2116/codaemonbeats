import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="h-screen bg-slate-50 flex items-center justify-center flex-col gap-8">
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 font-black text-5xl tracking-tight">
                CodaemonBeats
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-xl w-96 border border-gray-100">
                <h2 className="text-slate-800 text-2xl font-bold mb-8 text-center">Welcome Back</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100 text-center font-medium">{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="text-slate-600 text-sm font-bold block mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 border border-gray-200 rounded-lg p-3 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="text-slate-600 text-sm font-bold block mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-3 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <button className="bg-blue-600 text-white font-bold rounded-full p-3.5 mt-4 hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                        Log In
                    </button>
                </form>
                <div className="border-t border-gray-100 mt-8 pt-6 text-center">
                    <p className="text-slate-500 text-sm">Don't have an account?</p>
                    <Link to="/register" className="text-blue-600 font-bold hover:underline mt-2 block text-sm">Sign up for CodaemonBeats</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
