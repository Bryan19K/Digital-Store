import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const AdminLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: 'Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:flex flex-col">
                <div className="p-8 border-b border-gray-100">
                    <Link to="/" className="text-xl font-serif font-bold text-brand-black tracking-tight">
                        Digital Store
                        <span className="block text-[10px] font-sans text-gray-400 font-medium uppercase tracking-widest mt-1">Admin Panel</span>
                    </Link>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 text-sm font-medium ${isActive(item.path)
                                ? 'bg-brand-black text-white shadow-sm'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-brand-black'
                                }`}
                        >
                            <item.icon size={18} strokeWidth={isActive(item.path) ? 2 : 1.5} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
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
            <main className="flex-1 md:ml-64 p-8 lg:p-12 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
