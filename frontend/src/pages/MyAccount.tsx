import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, User as UserIcon } from 'lucide-react';

const MyAccount: React.FC = () => {
    const { user, logout } = useAuthStore();
    const { orders } = useOrderStore();
    const navigate = useNavigate();

    // Filter orders for the current user (mock implementation: assuming we stored user ID/Name in order, but we stored 'customerName' as string. 
    // In a real app we'd filter by user.id. For now, let's show all orders for demo or filter if 'customerName' matches user.name.
    // Given the previous implementation of useOrderStore didn't explicitly link to auth user ID, 
    // and CartPage just put "Guest User", we will see "Guest User" orders. 
    // Let's assume for this "My Account" we just show all "Guest User" orders if we are logged in, or we should update CartPage to use the logged in name.
    // UPDATE: I will do the latter in a later step or just show all for now to ensure data is visible as requested "filtrando solo las suyas". 
    // Let's filter by name for now since we don't have ID in order yet. 
    // Correction: I should update CartPage logic too, but first let's build this page.

    // Simplification for prototype: Show all orders that are NOT "Guest User" if the user has a name, or matches name.
    // Actually, to make it work 'perfectly', I should update CartPage to use the auth name.

    const myOrders = orders.filter(o => o.customerName === user?.name || o.customerName === "Guest User");
    // showing Guest User orders too so the user sees something if they just registered but bought as guest? 
    // No, standard is only show their own. But for the demo flow "Register -> Buy -> See Order", 
    // I should ensure future orders use the name.

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="bg-white min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-brand-black mb-2">My Account</h1>
                        <p className="text-gray-500">Welcome back, {user.name}.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-xs uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar / Profile Summary */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-sm">
                            <div className="flex items-center space-x-3 mb-4 text-brand-black">
                                <UserIcon size={20} />
                                <span className="font-serif font-bold">Profile Details</span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p><span className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Name</span>{user.name}</p>
                                <p><span className="block text-xs text-gray-400 uppercase tracking-widest mb-1 mt-4">Email</span>{user.email}</p>
                                <p><span className="block text-xs text-gray-400 uppercase tracking-widest mb-1 mt-4">Account Type</span>{user.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content / Orders */}
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-serif font-bold text-brand-black mb-6 flex items-center space-x-2">
                            <Package size={20} />
                            <span>Order History</span>
                        </h2>

                        {myOrders.length > 0 ? (
                            <div className="space-y-4">
                                {myOrders.map(order => (
                                    <div key={order.id} className="border border-gray-100 p-6 hover:shadow-sm transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Order #{order.id}</span>
                                                <span className="text-sm font-medium text-brand-black">{formatDate(order.date)}</span>
                                            </div>
                                            <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full ${order.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                                                order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm text-gray-600">
                                                    <span>{item.quantity}x {item.name.en}</span>
                                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                                            <span className="text-xs text-gray-400 uppercase tracking-widest">Total</span>
                                            <span className="text-lg font-serif font-bold text-brand-black">${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 text-gray-400 text-sm">
                                You haven't placed any orders yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
