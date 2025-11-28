import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(username, email, password);
        if (success) {
            navigate('/');
        } else {
            setError('Registration failed');
        }
    };

    return (
        <div className="h-screen bg-slate-50 flex items-center justify-center flex-col gap-8">
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 font-black text-5xl tracking-tight">
                CodaemonBeats
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-xl w-96 border border-gray-100">
                <h2 className="text-slate-800 text-2xl font-bold mb-8 text-center">Create Account</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100 text-center font-medium">{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="text-slate-600 text-sm font-bold block mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full bg-slate-50 border border-gray-200 rounded-lg p-3 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@domain.com"
                        />
                    </div>
                    <div>
                        <label className="text-slate-600 text-sm font-bold block mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 border border-gray-200 rounded-lg p-3 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
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
                                placeholder="Create a strong password"
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
                        Sign Up
                    </button>
                </form>
                <div className="border-t border-gray-100 mt-8 pt-6 text-center">
                    <p className="text-slate-500 text-sm">Already have an account?</p>
                    <Link to="/login" className="text-blue-600 font-bold hover:underline mt-2 block text-sm">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
