import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProductStore } from '../store/useProductStore';
import { useCategoryStore } from '../store/useCategoryStore';
import ProductCard from '../components/ProductCard';
import { useSettings } from '../context/SettingsContext';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const HomePage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { products } = useProductStore();
    const { categories } = useCategoryStore();
    const { settings } = useSettings();

    // Featured products
    const featuredProducts = products.slice(0, 4);

    const handleCategoryClick = (slug: string) => {
        navigate(`/shop?category=${slug}`);
    };

    // Construct simplified hero image URL (context already provides path)
    const getHeroImageUrl = () => {
        if (!settings.heroImage) return 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop';

        if (settings.heroImage.startsWith('http')) return settings.heroImage;

        // Use centralized image utility for uploaded images
        return getImageUrl(settings.heroImage);
    };

    return (
        <div className="bg-white">
            {/* Hero Section - Cinematic & Minimalist */}
            <div className="relative h-screen w-full overflow-hidden">
                {/* Background Image with Slow Zoom Effect */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-slow-zoom"
                    style={{ backgroundImage: `url("${getHeroImageUrl()}")`, filter: 'brightness(0.7)' }}
                />

                {/* Hero Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4 animate-fade-in-up">
                    <p className="text-xs md:text-sm uppercase tracking-[0.3em] mb-6 font-medium text-gray-200">
                        Spring / Summer 2026
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight mb-10 leading-none">
                        Essential<br />Luxury
                    </h1>
                    <Link
                        to="/shop"
                        className="group relative px-10 py-4 border border-white/30 text-white uppercase tracking-[0.2em] text-xs font-semibold hover:bg-white hover:text-brand-black transition-all duration-500 overflow-hidden"
                    >
                        <span className="relative z-10">Discover Collection</span>
                    </Link>
                </div>
            </div>

            {/* Featured Collection - "New Arrivals" */}
            <section className="py-24 md:py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center mb-12">
                        <span className="text-brand-gold uppercase tracking-[0.2em] text-xs font-semibold mb-3">Curated Selection</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-brand-black text-center">New Arrivals</h2>
                    </div>

                    {/* Category Navigation */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => handleCategoryClick(cat.slug)}
                                className="group flex flex-col items-center space-y-3"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-gray flex items-center justify-center border border-transparent group-hover:border-brand-gold transition-all duration-300">
                                    <span className="text-brand-black font-serif text-lg md:text-xl">
                                        {(i18n.language === 'es' ? cat.name_es : cat.name_en).charAt(0)}
                                    </span>
                                </div>
                                <span className="text-[10px] md:text-xs uppercase tracking-widest font-medium text-gray-500 group-hover:text-brand-black transition-colors">
                                    {i18n.language === 'es' ? cat.name_es : cat.name_en}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <Link
                            to="/shop"
                            className="inline-block border-b border-brand-black pb-1 text-sm uppercase tracking-[0.2em] font-medium hover:text-gray-600 hover:border-gray-600 transition-colors"
                        >
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* Banner Section - "The Philosophy" */}
            <section className="relative py-32 bg-brand-gray overflow-hidden">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="aspect-[4/5] overflow-hidden bg-gray-200 relative z-10">
                            <img
                                src="https://images.unsplash.com/photo-1507702662836-9b195e72e33f?q=80&w=1500&auto=format&fit=crop"
                                alt="Philosophy"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Decorative Element */}
                        <div className="absolute -bottom-8 -left-8 w-full h-full border border-brand-gold/30 -z-0 hidden md:block"></div>
                    </div>

                    <div className="order-1 md:order-2 md:pl-12">
                        <span className="block text-xs font-bold uppercase tracking-[0.25em] text-brand-gold mb-6">Our Philosophy</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-brand-black mb-8 leading-tight">
                            Less noise.<br />More silence.
                        </h2>
                        <p className="text-gray-500 mb-8 leading-relaxed font-light text-lg">
                            We believe that true luxury lies in simplicity. By stripping away the unnecessary, we focus on what truly matters: exceptional materials, precise tailoring, and timeless silhouettes.
                        </p>
                        <Link
                            to="/about"
                            className="text-xs font-bold uppercase tracking-[0.2em] text-brand-black hover:text-brand-gold transition-colors"
                        >
                            Read Our Story
                        </Link>
                    </div>
                </div>
            </section>

            {/* Marquee / Brand Values (Optional for High-End Feel) */}
            <div className="bg-brand-black text-white py-12 border-t border-white/10">
                <div className="container mx-auto px-6 flex justify-around flex-wrap gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <span className="font-serif text-xl mb-2 italic">Sustainable</span>
                        <span className="text-[10px] uppercase tracking-widest text-gray-500">Ethically Sourced</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-serif text-xl mb-2 italic">Timeless</span>
                        <span className="text-[10px] uppercase tracking-widest text-gray-500">Designed to Last</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-serif text-xl mb-2 italic">Exclusive</span>
                        <span className="text-[10px] uppercase tracking-widest text-gray-500">Limited Production</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
