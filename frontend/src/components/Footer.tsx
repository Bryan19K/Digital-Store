import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Footer: React.FC = () => {
    const { user } = useAuthStore();

    return (
        <footer className="bg-white text-brand-black border-t border-gray-100 pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
                    {/* Brand Identity */}
                    <div className="space-y-6">
                        <Link to="/" className="text-2xl font-serif font-bold tracking-tight block">
                            Digital Store
                        </Link>
                        <p className="text-gray-500 text-sm font-light leading-relaxed max-w-xs">
                            Elevating your daily style with curated essentials.
                            Timeless design for the modern individual.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 text-gray-900">Explore</h4>
                        <Link to="/shop" className="text-sm text-gray-500 hover:text-brand-black transition-colors">Shop Collection</Link>
                        <Link to="/about" className="text-sm text-gray-500 hover:text-brand-black transition-colors">About Us</Link>
                        <Link to="/contact" className="text-sm text-gray-500 hover:text-brand-black transition-colors">Contact</Link>
                        {user?.role === 'ADMIN' && (
                            <Link to="/admin" className="text-sm text-gray-500 hover:text-brand-black transition-colors">Admin Dashboard</Link>
                        )}
                    </div>

                    {/* Socials */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 text-gray-900">Follow Us</h4>
                        <div className="flex space-x-6 text-gray-500">
                            <a href="#" className="hover:text-brand-black transition-colors">
                                <Instagram size={20} strokeWidth={1} />
                            </a>
                            <a href="#" className="hover:text-brand-black transition-colors">
                                <Twitter size={20} strokeWidth={1} />
                            </a>
                            <a href="#" className="hover:text-brand-black transition-colors">
                                <Facebook size={20} strokeWidth={1} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                    <p>&copy; 2026 Digital Store. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-brand-black transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-black transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
