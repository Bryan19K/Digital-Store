import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'es', name: 'Español', flag: 'ES' },
        { code: 'en', name: 'English', flag: 'EN' },
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleLanguage = (code: string) => {
        i18n.changeLanguage(code);
        localStorage.setItem('language', code);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.1em] text-gray-500 hover:text-brand-black transition-colors focus:outline-none"
            >
                <Globe size={14} className="opacity-70" />
                <span>{currentLanguage.flag}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 shadow-xl rounded-sm py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => toggleLanguage(lang.code)}
                            className={`w-full text-left px-4 py-2 text-[11px] uppercase tracking-wider transition-colors hover:bg-gray-50 ${i18n.language === lang.code ? 'text-brand-black font-bold' : 'text-gray-500'
                                }`}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
