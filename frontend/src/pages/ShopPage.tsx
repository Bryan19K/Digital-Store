import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { productService } from '../services/product.service';

export const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔌 PRUEBA DE CONEXIÓN BACKEND ↔ FRONTEND
    api.get('/test')
      .then(res => {
        console.log('✅ Backend conectado:', res.data);
      })
      .catch(err => {
        console.error('❌ No conecta al backend:', err);
      });

    // 📦 CARGAR PRODUCTOS
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 hover:shadow-lg transition"
          >
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-48 object-cover mb-4 rounded"
            />

            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>

            <button className="mt-3 w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
