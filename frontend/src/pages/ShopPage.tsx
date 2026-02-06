import React, { useEffect, useState } from 'react';
import { productService } from '../services/product.service';
import api from '../api/axiosInstance';
import { useTranslation } from 'react-i18next'; // 1. Importamos el hook de traducción

// 2. Definimos la interfaz para que TypeScript reconozca la estructura bilingüe
interface Product {
  _id: string;
  name: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  price: number;
  images: string[];
  category: string;
}

const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation(); // 3. Obtenemos i18n para saber el idioma actual
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Prueba de conexión (puedes comentarla después)
        const testResponse = await api.get('/test');
        console.log('Test connection:', testResponse.data);

        // Carga real de productos
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading products...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t('shop_title') || 'Shop'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
            {product.images && product.images[0] && (
              <img 
                src={product.images[0]} 
                alt={product.name.en} 
                className="w-full h-64 object-cover mb-4 rounded"
              />
            )}
            <h2 className="text-xl font-semibold">
              {/* 4. Lógica de selección de idioma aplicada aquí */}
              {i18n.language.startsWith('es') ? product.name.es : product.name.en}
            </h2>
            <p className="text-gray-600 mt-2">
              {i18n.language.startsWith('es') ? product.description.es : product.description.en}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-600">${product.price}</span>
              <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
                {t('add_to_cart') || 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;