import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProductStore } from '../store/useProductStore';
import { useCategoryStore } from '../store/useCategoryStore';
import ProductCard from '../components/ProductCard';
import { Search, Filter } from 'lucide-react';

const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const { products, fetchProducts } = useProductStore();
  const { categories: categoryList, fetchCategories } = useCategoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  React.useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const categories = ["All", ...categoryList.map(c => c.slug)];

  const filteredProducts = products.filter(product => {
    const productNameEn = product.name?.en || '';
    const productNameEs = product.name?.es || '';

    const matchesSearch = productNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productNameEs.toLowerCase().includes(searchTerm.toLowerCase());

    const productCategorySlug = typeof product.category === 'string'
      ? product.category
      : product.category?.slug;

    const matchesCategory = selectedCategory === "All" || productCategorySlug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6 mb-12">
        <h1 className="text-4xl font-serif text-brand-black mb-8">{t('shop_title')}</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t('search_products') || "Search..."}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-brand-black transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              className="w-full pl-10 pr-8 py-3 border border-gray-200 text-sm focus:outline-none focus:border-brand-black appearance-none bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categoryList.map(category => (
                <option key={category._id} value={category.slug}>
                  {i18n.language === 'es' ? category.name_es : category.name_en}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 xl:gap-x-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No products found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;