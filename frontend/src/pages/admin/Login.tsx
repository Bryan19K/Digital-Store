import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = await login(username, password);
        if (success) {
            const currentUser = useAuthStore.getState().user;
            if (currentUser?.role?.toLowerCase() === 'admin') {
                navigate('/admin');
            } else {
                setError('Access denied. Admin privileges required.');
                // Optionally logout if they are not admin
            }
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-serif font-bold text-brand-black tracking-tight mb-2">
                        Digital Store
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Admin Access</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors bg-transparent placeholder-gray-300 rounded-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors bg-transparent placeholder-gray-300 rounded-none"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-brand-black text-white py-4 uppercase tracking-[0.2em] font-medium text-xs hover:bg-gray-800 transition-colors flex justify-center items-center space-x-2 mt-8"
                    >
                        <span>Enter Dashboard</span>
                        <ArrowRight size={14} />
                    </button>
                </form>

                <div className="mt-12 text-center text-[10px] text-gray-300 uppercase tracking-widest">
                    Secured System
                </div>
            </div>
        </div>
    );
};

export default Login;
