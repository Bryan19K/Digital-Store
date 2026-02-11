import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ArrowRight } from 'lucide-react';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const register = useAuthStore((state) => state.register);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError('All fields are required');
            return;
        }

        try {
            const success = await register(name, email, password);
            if (success) {
                navigate('/profile');
            } else {

                setError('Registration failed. Please check the console (F12) for details.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'An unexpected error occurred');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-16">
            <div className="w-full max-w-sm">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-serif font-bold text-brand-black tracking-tight mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-500 text-sm">Join our exclusive community</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border-b border-gray-200 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors bg-transparent placeholder-gray-300 rounded-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <input
                            type="email"
                            placeholder="Email Address"
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
                        <span>Register</span>
                        <ArrowRight size={14} />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-black underline hover:text-gray-700">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
