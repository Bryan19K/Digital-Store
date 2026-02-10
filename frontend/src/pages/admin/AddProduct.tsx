import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { ArrowLeft, Save } from 'lucide-react';

const AddProduct: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addProduct, updateProduct, products } = useProductStore();
    const { categories, fetchCategories } = useCategoryStore();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        nameEn: '',
        nameEs: '',
        price: '',
        category: '',
        descriptionEn: '',
        descriptionEs: '',
        imageUrl: '',
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
        if (isEditMode && id) {
            const productToEdit = products.find(p => p._id === id);
            if (productToEdit) {
                setFormData({
                    nameEn: productToEdit.name.en,
                    nameEs: productToEdit.name.es,
                    price: productToEdit.price.toString(),
                    category: typeof productToEdit.category === 'string'
                        ? productToEdit.category
                        : productToEdit.category?._id || '',
                    descriptionEn: productToEdit.description.en,
                    descriptionEs: productToEdit.description.es,
                    imageUrl: productToEdit.images[0] || '',
                });
            } else {
                navigate('/admin'); // Product not found
            }
        }
    }, [id, isEditMode, products, navigate, fetchCategories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.nameEn || !formData.price || !formData.category || !formData.imageUrl) {
            setError('Please fill in all required fields (Name, Price, Category, Image).');
            return;
        }

        if (Number(formData.price) <= 0) {
            setError('Price must be a positive number.');
            return;
        }

        const productData = {
            name: { en: formData.nameEn, es: formData.nameEs || formData.nameEn },
            description: { en: formData.descriptionEn, es: formData.descriptionEs || formData.descriptionEn },
            price: Number(formData.price),
            category: formData.category,
            images: [formData.imageUrl],
        };

        if (isEditMode && id) {
            updateProduct(id, productData);
            alert('Product updated successfully!');
        } else {
            addProduct(productData);
            alert('Product added successfully!');
        }

        navigate('/admin');
    };

    return (
        <div className="max-w-3xl mx-auto">
            <button onClick={() => navigate('/admin')} className="flex items-center text-sm text-gray-500 hover:text-brand-black mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </button>

            <h1 className="text-3xl font-serif font-bold text-brand-black mb-8">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 mb-6 text-sm border-l-4 border-red-500">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">

                {/* General Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Product Name (EN) *</label>
                        <input
                            type="text"
                            name="nameEn"
                            value={formData.nameEn}
                            onChange={handleChange}
                            className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
                            placeholder="e.g. Silk Shirt"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Nombre del Producto (ES)</label>
                        <input
                            type="text"
                            name="nameEs"
                            value={formData.nameEs}
                            onChange={handleChange}
                            className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
                            placeholder="e.g. Camisa de Seda"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Price *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0.01"
                            step="0.01"
                            className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
                            placeholder="0.00"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-brand-black bg-white transition-colors"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name_en} / {cat.name_es}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Image URL *</label>
                    <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Description (EN)</label>
                    <textarea
                        name="descriptionEn"
                        value={formData.descriptionEn}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
                    ></textarea>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        className="w-full bg-brand-black text-white py-4 uppercase tracking-widest font-medium text-sm hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                    >
                        <Save size={18} />
                        <span>{isEditMode ? 'Update Product' : 'Save Product'}</span>
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddProduct;
