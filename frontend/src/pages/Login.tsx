import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const user = useAuthStore((state) => state.user);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = await login(email, password);
        if (success) {
            // We need to check the updated state. 
            // Since await finished, the store should be updated.
            const currentUser = useAuthStore.getState().user;

            if (currentUser?.role?.toLowerCase() === 'admin') {
                navigate('/admin');
            } else {
                navigate('/profile');
            }
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-16">
            <div className="w-full max-w-sm">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-serif font-bold text-brand-black tracking-tight mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 text-sm">Please sign in to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="Email / Username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        <span>Sign In</span>
                        <ArrowRight size={14} />
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-black font-semibold underline">
                                Create one
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
