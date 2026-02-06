import React from 'react'; // <--- Añade esto arriba de todo
import { Routes, Route } from 'react-router-dom';
import { ShopPage } from './pages/ShopPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ShopPage />} />
    </Routes>
  );
}

export default App;
