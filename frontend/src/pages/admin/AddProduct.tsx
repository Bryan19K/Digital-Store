import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

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
    });

    // Separate state for image handling
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [existingImageUrl, setExistingImageUrl] = useState<string>('');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
                });

                // Handle existing image for preview
                if (productToEdit.images && productToEdit.images.length > 0) {
                    const img = productToEdit.images[0];
                    setExistingImageUrl(img);

                    // Use centralized utility for preview
                    setPreviewUrl(getImageUrl(img));
                }
            } else {
                navigate('/admin'); // Product not found
            }
        }
    }, [id, isEditMode, products, navigate, fetchCategories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setPreviewUrl('');
        setExistingImageUrl('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (!formData.nameEn || !formData.price || !formData.category) {
            setError('Please fill in all required fields (Name, Price, Category).');
            setLoading(false);
            return;
        }

        if (!isEditMode && !imageFile && !existingImageUrl) {
            setError('Please upload an image for the new product.');
            setLoading(false);
            return;
        }

        if (Number(formData.price) <= 0) {
            setError('Price must be a positive number.');
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();
            data.append('nameEn', formData.nameEn);
            data.append('nameEs', formData.nameEs || formData.nameEn);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('descriptionEn', formData.descriptionEn);
            data.append('descriptionEs', formData.descriptionEs || formData.descriptionEn);

            if (imageFile) {
                data.append('image', imageFile);
            } else if (existingImageUrl) {
                // If checking an existing product and no new file, we might want to preserve the old one
                // The backend logic handles this if we don't send anything, or we can send the string
                data.append('imageUrl', existingImageUrl);
            }

            let success = false;

            if (isEditMode && id) {
                success = await updateProduct(id, data);
            } else {
                success = await addProduct(data);
            }

            if (success) {
                alert(isEditMode ? 'Product updated successfully!' : 'Product added successfully!');
                navigate('/admin');
            } else {
                setError('Failed to save product. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred.');
        } finally {
            setLoading(false);
        }
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

                {/* Image Upload Area */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Product Image *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative">

                        {previewUrl ? (
                            <div className="relative w-full max-w-sm">
                                <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-md shadow-sm" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                <Upload size={40} className="text-gray-400 mb-4" />
                                <span className="text-sm font-medium text-gray-700">Click to upload image</span>
                                <span className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (Max 5MB)</span>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
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
                        disabled={loading}
                        className="w-full bg-brand-black text-white py-4 uppercase tracking-widest font-medium text-sm hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>{isEditMode ? 'Update Product' : 'Save Product'}</span>
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddProduct;
