import React from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { Package } from 'lucide-react';

const Orders: React.FC = () => {
    const { orders } = useOrderStore();

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-brand-black">Orders</h1>
                <p className="text-gray-500 mt-2">Manage customer orders and shipments.</p>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500 font-semibold border-b border-gray-100">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-mono text-xs text-gray-500">#{order.id}</td>
                                <td className="p-4 text-sm text-brand-black">{formatDate(order.date)}</td>
                                <td className="p-4 text-sm text-gray-600">{order.customerName}</td>
                                <td className="p-4 text-sm text-gray-500">
                                    <div className="flex flex-col">
                                        {order.items.map((item, idx) => (
                                            <span key={idx} className="block text-xs">
                                                {item.quantity}x {item.name.en}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 text-sm font-medium text-brand-black">${order.total.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400 text-sm">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
