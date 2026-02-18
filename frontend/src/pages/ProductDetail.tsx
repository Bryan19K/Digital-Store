import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../store/useCartStore';
import { useProductStore } from '../store/useProductStore';
import { Plus, Minus, Truck, Shield, RotateCcw } from 'lucide-react';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const addToCart = useCartStore((state) => state.addToCart);
    const { products, fetchProducts, loading: productsLoading } = useProductStore();

    // Find product from store
    const product = products.find(p => p._id === id);

    // Fetch products if not in store
    useEffect(() => {
        if (products.length === 0) {
            fetchProducts();
        }
    }, [products.length, fetchProducts]);

    if (productsLoading && !product) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-black"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-white pt-24 px-6 text-center">
                <h2 className="text-2xl font-serif mb-4">Product not found</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    The product you are looking for might have been removed or the link is incorrect.
                </p>
                <button
                    onClick={() => navigate('/shop')}
                    className="bg-brand-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                    Return to Shop
                </button>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product);
        alert(t('added_to_cart_success') || 'Product added to cart');
    };

    const isEs = i18n.language.startsWith('es');

    return (
        <div className="bg-white min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

                    <div className="space-y-4">
                        <div className="aspect-[3/4] bg-gray-100 overflow-hidden w-full">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={getImageUrl(product.images[0])}
                                    alt={isEs ? (product.name?.es || '') : (product.name?.en || '')}
                                    className="w-full h-full object-cover object-center"
                                    onError={handleImageError}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {product.images?.map((img, idx) => (
                                <div key={idx} className="aspect-square bg-gray-50 cursor-pointer border border-transparent hover:border-black transition-colors">
                                    <img
                                        src={getImageUrl(img)}
                                        className="w-full h-full object-cover"
                                        alt={`Thumb ${idx}`}
                                        onError={handleImageError}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="flex flex-col pt-4">
                        <div className="mb-8 border-b border-gray-100 pb-8">
                            <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">
                                {typeof product.category === 'string' ? product.category : (isEs ? product.category?.name_es : product.category?.name_en)}
                            </p>
                            <h1 className="text-4xl font-serif text-brand-black mb-4 leading-tight">
                                {isEs ? (product.name?.es || 'Untitled') : (product.name?.en || 'Untitled')}
                            </h1>
                            <p className="text-2xl font-medium text-brand-black">
                                ${product.price?.toFixed(2) || '0.00'}
                            </p>
                        </div>

                        <div className="mb-8">
                            <p className="text-gray-600 leading-relaxed font-light">
                                {isEs ? (product.description?.es || '') : (product.description?.en || '')}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-6 mb-12">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-brand-black text-white py-4 uppercase tracking-[0.2em] text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                {t('add_to_cart')}
                            </button>
                        </div>


                        <div className="grid grid-cols-1 gap-6 border-t border-gray-100 pt-8">
                            <div className="flex items-start space-x-4">
                                <Truck size={20} strokeWidth={1.5} className="text-gray-400 mt-1" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Free Shipping</h4>
                                    <p className="text-xs text-gray-500 font-light">On all orders over $150</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <RotateCcw size={20} strokeWidth={1.5} className="text-gray-400 mt-1" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Easy Returns</h4>
                                    <p className="text-xs text-gray-500 font-light">30-day return policy</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <Shield size={20} strokeWidth={1.5} className="text-gray-400 mt-1" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Secure Payment</h4>
                                    <p className="text-xs text-gray-500 font-light">Encrypted transaction</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;