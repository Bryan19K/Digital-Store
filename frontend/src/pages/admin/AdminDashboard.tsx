import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useOrderStore } from '../../store/useOrderStore';

const AdminDashboard: React.FC = () => {
    const { products, deleteProduct } = useProductStore();
    const { orders } = useOrderStore();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const isEs = i18n.language.startsWith('es');

    // Stats
    const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
    const newOrdersCount = orders.filter(o => o.status === 'Pending').length;

    const stats = [
        { label: 'Total Sales', value: `$${totalSales.toFixed(2)}` },
        { label: 'Total Products', value: products.length },
        { label: 'New Orders', value: newOrdersCount },
    ];

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-brand-black">Dashboard</h1>
                    <p className="text-gray-500 mt-2">Welcome back, Admin.</p>
                </div>
                <Link
                    to="/admin/add"
                    className="bg-brand-black text-white px-6 py-3 text-sm uppercase tracking-widest font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                    <Plus size={16} />
                    <span>Add Product</span>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 border border-gray-100 shadow-sm">
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">{stat.label}</p>
                        <p className="text-2xl font-serif text-brand-black">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Product Table */}
            <div>
                <h2 className="text-xl font-serif font-bold text-brand-black mb-6">Product Management</h2>
                <div className="overflow-x-auto bg-white border border-gray-100 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500 font-semibold border-b border-gray-100">
                                <th className="p-4">Product</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 flex items-center space-x-4">
                                        <div className="h-12 w-12 bg-gray-100 overflow-hidden rounded-sm">
                                            <img
                                                src={product.images[0]}
                                                alt={isEs ? product.name.es : product.name.en}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <span className="font-medium text-brand-black text-sm">
                                            {isEs ? product.name.es : product.name.en}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">{product.category}</td>
                                    <td className="p-4 text-sm font-medium text-brand-black">${product.price}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => navigate(`/admin/edit/${product._id}`)}
                                            className="text-gray-400 hover:text-brand-black transition-colors p-1"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this product?')) {
                                                    deleteProduct(product._id);
                                                }
                                            }}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
