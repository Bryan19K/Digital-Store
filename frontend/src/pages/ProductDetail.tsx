import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Importamos los mocks que creamos antes
import { MOCK_PRODUCTS } from '../mocks/products';
import { useCartStore } from '../store/useCartStore';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    // Buscamos el producto en nuestro array de prueba
    const product = MOCK_PRODUCTS.find(p => p._id === id);

    if (!product) {
        return (
            <div className="text-center p-20">
                <h2 className="text-2xl font-bold">{t('product_not_found')}</h2>
                <button onClick={() => navigate('/')} className="mt-4 text-blue-500 underline">
                    {t('back_to_shop')}
                </button>
            </div>
        );
    }
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        addToCart(product);
        alert(t('added_to_cart_success') || '¡Producto añadido!');
    };

    const isEs = i18n.language.startsWith('es');

    return (
        <div className="bg-white">
            <div className="pt-6 pb-16 sm:pb-24">
                <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">

                        {/* Galería de Imágenes */}
                        <div className="flex flex-col-reverse">
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                                <img
                                    src={product.images[0]}
                                    alt={product.name.en}
                                    className="h-full w-full object-cover object-center sm:rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Información del Producto */}
                        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                {isEs ? product.name.es : product.name.en}
                            </h1>

                            <div className="mt-3">
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-3xl tracking-tight text-blue-600 font-bold">${product.price}</p>
                            </div>

                            <div className="mt-6">
                                <h3 className="sr-only">Description</h3>
                                <div className="space-y-6 text-base text-gray-700">
                                    {isEs ? product.description.es : product.description.en}
                                </div>
                            </div>

                            <div className="mt-10 flex">
                                <button
                                    onClick={handleAddToCart} // <--- ¡AQUÍ ESTÁ LA CONEXIÓN!
                                    className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-full"
                                >
                                    {t('add_to_cart')}
                                </button>
                            </div>

                            <p className="mt-4 text-sm text-gray-500">
                                {t('stock_available')}: {product.category}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;