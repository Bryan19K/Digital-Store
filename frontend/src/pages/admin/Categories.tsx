import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, ExternalLink } from 'lucide-react';
import { useCategoryStore, Category } from '../../store/useCategoryStore';
import { useProductStore } from '../../store/useProductStore';
import { useNavigate } from 'react-router-dom';

const Categories: React.FC = () => {
    const { categories, isLoading, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
    const { products, fetchProducts } = useProductStore();
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name_es: '', name_en: '', slug: '' });

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [fetchCategories, fetchProducts]);

    const getProductsForCategory = (categoryId: string) => {
        // Safe access to products array
        const allProducts = products || [];
        return allProducts.filter(p =>
            typeof p.category === 'string' ? p.category === categoryId : p.category?._id === categoryId
        );
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await addCategory(formData);
        if (success) {
            setIsAdding(false);
            setFormData({ name_es: '', name_en: '', slug: '' });
        }
    };

    const handleUpdate = async (id: string) => {
        const success = await updateCategory(id, formData);
        if (success) {
            setEditingId(null);
            setFormData({ name_es: '', name_en: '', slug: '' });
        }
    };

    const startEditing = (category: Category) => {
        setEditingId(category._id);
        setFormData({ name_es: category.name_es, name_en: category.name_en, slug: category.slug });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setIsAdding(false);
        setFormData({ name_es: '', name_en: '', slug: '' });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-brand-black">Categories</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage product categories</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center space-x-2 bg-brand-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        <Plus size={16} />
                        <span>Add Category</span>
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Name (Spanish)</label>
                            <input
                                type="text"
                                required
                                value={formData.name_es}
                                onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Name (English)</label>
                            <input
                                type="text"
                                required
                                value={formData.name_en}
                                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Slug</label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-black"
                                />
                                <button type="submit" className="bg-brand-black text-white p-2 rounded-md hover:bg-gray-800">
                                    <Check size={20} />
                                </button>
                                <button type="button" onClick={cancelEditing} className="bg-gray-100 text-gray-500 p-2 rounded-md hover:bg-gray-200">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Category Name (Count)</th>
                            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Slug</th>
                            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Products</th>
                            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading categories...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No categories found.</td></tr>
                        ) : categories.map((cat) => (
                            <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    {editingId === cat._id ? (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Spanish Name"
                                                value={formData.name_es}
                                                onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
                                                className="w-full px-2 py-1 border border-gray-200 rounded-md focus:outline-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="English Name"
                                                value={formData.name_en}
                                                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                                className="w-full px-2 py-1 border border-gray-200 rounded-md focus:outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            <button
                                                onClick={() => navigate(`/admin/products?category=${cat.slug}`)}
                                                className="text-left font-medium text-brand-black hover:text-brand-gold flex items-center group"
                                            >
                                                <span>{cat.name_en} / {cat.name_es}</span>
                                                <ExternalLink size={12} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <span className="ml-2 text-xs text-gray-400 font-normal">
                                                    ({getProductsForCategory(cat._id)?.length || 0})
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === cat._id ? (
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full px-2 py-1 border border-gray-200 rounded-md focus:outline-none"
                                        />
                                    ) : (
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-mono uppercase tracking-widest">{cat.slug}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2 max-w-xs">
                                        {(getProductsForCategory(cat._id) || []).length > 0 ? (
                                            getProductsForCategory(cat._id).map(p => (
                                                <span
                                                    key={p._id}
                                                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 border border-gray-200"
                                                >
                                                    {p.name?.en || 'Untitled'}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-300 border border-gray-100">
                                                Vacío
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {editingId === cat._id ? (
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => handleUpdate(cat._id)} className="text-green-600 hover:text-green-700">
                                                <Check size={18} />
                                            </button>
                                            <button onClick={cancelEditing} className="text-gray-400 hover:text-gray-600">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end space-x-3">
                                            <button onClick={() => startEditing(cat)} className="text-gray-400 hover:text-brand-black">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => deleteCategory(cat._id)} className="text-gray-400 hover:text-red-600">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Categories;
