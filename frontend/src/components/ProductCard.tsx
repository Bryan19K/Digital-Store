import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../store/useCartStore';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

import { Product } from '../types/Product';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { t, i18n } = useTranslation();
    const addToCart = useCartStore((state) => state.addToCart);
    const [isHovered, setIsHovered] = useState(false);
    const isEs = i18n.language.startsWith('es');

    return (
        <div
            className="group relative flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={`/product/${product._id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                    src={getImageUrl(product.images?.[0])}
                    alt={isEs ? (product.name?.es || '') : (product.name?.en || '')}
                    className={`h-full w-full object-cover object-center transition-transform duration-700 ease-in-out ${isHovered ? 'scale-110' : 'scale-100'
                        }`}
                    onError={handleImageError}
                />

                {/* Category Badge */}
                {product.category && typeof product.category !== 'string' && (
                    <div className="absolute top-4 left-4 z-10">
                        <span
                            className="px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-white"
                            style={{ backgroundColor: product.category.color }}
                        >
                            {isEs ? product.category.name_es : product.category.name_en}
                        </span>
                    </div>
                )}

                {/* Secondary Image Overlay (Optional: if product has 2nd image) */}
                {/* 
                {product.images[1] && (
                    <img 
                        src={product.images[1]} 
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    />
                )}
                */}

                {/* Quick Add Button - appears on hover */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                    }}
                    className={`absolute bottom-4 right-4 bg-white text-brand-black p-3 shadow-lg transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        } hover:bg-brand-black hover:text-white`}
                    aria-label="Add to cart"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </Link>

            {/* Product Info */}
            <div className="mt-4 flex flex-col items-start space-y-1">
                <h3 className="text-sm font-semibold text-brand-black tracking-wide">
                    <Link to={`/product/${product._id}`}>
                        {isEs ? (product.name?.es || 'Untitled') : (product.name?.en || 'Untitled')}
                    </Link>
                </h3>
                <p className="text-sm text-gray-500 font-light">
                    ${product.price?.toFixed(2) || '0.00'}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
