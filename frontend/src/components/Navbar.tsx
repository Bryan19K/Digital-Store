import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import LanguageSelector from './LanguageSelector';
import { useSettings } from '../context/SettingsContext';

const Navbar: React.FC = () => {
    const { t } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { settings } = useSettings();
    const cart = useCartStore((state) => state.cart);
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleUserClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (user?.role?.toLowerCase() === 'admin') {
            navigate('/admin');
        } else {
            navigate('/profile');
        }
    };

    const handleSearchClick = () => {
        navigate('/shop');
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full z-50 flex flex-col">
            {/* Top Bar */}
            <div className="bg-brand-black text-white py-1.5 text-center px-4 hidden sm:block">
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium">{t('free_shipping')}</p>
            </div>

            {/* Main Navbar */}
            <nav
                className={`w-full transition-all duration-300 border-b border-white/5 ${isScrolled
                    ? 'bg-white/80 backdrop-blur-md border-gray-100 py-3 shadow-sm'
                    : 'bg-transparent py-5 text-brand-black'
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-brand-black focus:outline-none"
                    >
                        {isMobileMenuOpen ? <X size={20} strokeWidth={1} /> : <Menu size={20} strokeWidth={1} />}
                    </button>

                    {/* Logo */}
                    <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-brand-black">
                        {settings.storeName}
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex space-x-12 items-center">
                        <Link to="/" className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-500 hover:text-brand-black transition-colors">
                            {t('nav_home')}
                        </Link>
                        <Link to="/shop" className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-500 hover:text-brand-black transition-colors">
                            {t('nav_shop')}
                        </Link>
                        <LanguageSelector />
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={handleSearchClick}
                            className="text-brand-black hover:text-brand-gold transition-colors hidden sm:block"
                        >
                            <Search size={18} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={handleUserClick}
                            className="text-brand-black hover:text-brand-gold transition-colors"
                        >
                            <User size={18} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={() => navigate('/cart')}
                            className="text-brand-black hover:text-brand-gold transition-colors relative"
                        >
                            <ShoppingBag size={18} strokeWidth={1.5} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-brand-black text-white text-[9px] font-medium w-3.5 h-3.5 flex items-center justify-center rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-white z-40 flex flex-col pt-24 px-8 md:hidden">
                    <div className="flex flex-col space-y-8 animate-fade-in text-center items-center">
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-3xl font-serif text-brand-black"
                        >
                            {t('nav_home')}
                        </Link>
                        <Link
                            to="/shop"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-3xl font-serif text-brand-black"
                        >
                            {t('nav_shop')}
                        </Link>
                        <div className="pt-4 pb-2">
                            <LanguageSelector />
                        </div>
                        <div className="pt-8 border-t border-gray-100 w-full">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Account</p>
                            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg text-gray-600 mb-2">{t('nav_cart')} ({totalItems})</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
