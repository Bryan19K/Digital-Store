import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Tag, Menu, X, User, ArrowLeft, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSettings } from '../../context/SettingsContext';

const AdminLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const { settings } = useSettings();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const isActive = (path: string) => location.pathname === path;

    const isAdmin = user?.role?.trim().toLowerCase() === 'admin';

    const navItems = [
        { name: 'Overview', path: '/admin', icon: LayoutDashboard, show: isAdmin },
        { name: 'Products', path: '/admin/products', icon: Package, show: isAdmin },
        { name: 'Categories', path: '/admin/categories', icon: Tag, show: isAdmin },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart, show: true },
        { name: 'Settings', path: '/admin/settings', icon: Settings, show: isAdmin },
    ];

    const filteredNavItems = navItems.filter(item => item.show);

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans relative">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center px-4">
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 text-gray-500 hover:text-brand-black transition-colors"
                    aria-label="Toggle Menu"
                >
                    <Menu size={24} />
                </button>
                <div className="ml-4 flex-1">
                    <span className="text-lg font-serif font-bold text-brand-black">{settings?.storeName || 'Digital Store'}</span>
                </div>
            </header>

            {/* Backdrop for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar / Drawer */}
            <aside
                className={`w-64 bg-white border-r border-gray-200 fixed h-full z-50 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <Link to="/" className="text-xl font-serif font-bold text-brand-black tracking-tight" onClick={closeMobileMenu}>
                        {settings?.storeName || 'Digital Store'}
                        <span className="block text-[10px] font-sans text-gray-400 font-medium uppercase tracking-widest mt-1">Admin Panel</span>
                    </Link>
                    <button
                        onClick={closeMobileMenu}
                        className="md:hidden p-2 text-gray-400 hover:text-brand-black transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                    {filteredNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={closeMobileMenu}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 text-sm font-medium ${isActive(item.path)
                                ? 'bg-brand-black text-white shadow-sm'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-brand-black'
                                }`}
                        >
                            <item.icon size={18} strokeWidth={isActive(item.path) ? 2 : 1.5} />
                            <span>{item.name}</span>
                        </Link>
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                        <Link
                            to="/"
                            onClick={closeMobileMenu}
                            className="flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-brand-black"
                        >
                            <ArrowLeft size={18} />
                            <span>Back to Store</span>
                        </Link>
                    </div>
                </nav>

                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 text-gray-400 hover:text-red-500 transition-colors px-4 py-2 text-sm font-medium"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 lg:p-12 overflow-y-auto mt-16 md:mt-0">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
