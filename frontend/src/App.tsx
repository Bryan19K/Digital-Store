import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ShopPage from './pages/ShopPage';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetail/>} />
        
      </Routes>
    </div>
  );
}

export default App;
