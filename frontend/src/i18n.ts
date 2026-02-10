import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLanguage = localStorage.getItem('language') || 'es';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          nav_home: 'Home',
          nav_shop: 'Shop',
          nav_account: 'Account',
          nav_cart: 'Cart',
          add_to_cart: 'Add to Cart',
          free_shipping: 'Free Shipping on Orders Over $150',
          welcome_admin: 'Welcome back, Admin.',
          dashboard: 'Dashboard',
        },
      },
      es: {
        translation: {
          nav_home: 'Inicio',
          nav_shop: 'Tienda',
          nav_account: 'Mi Cuenta',
          nav_cart: 'Carrito',
          add_to_cart: 'Agregar al carrito',
          free_shipping: 'Envío gratis en pedidos superiores a $150',
          welcome_admin: 'Bienvenido de nuevo, Administrador.',
          dashboard: 'Panel de Control',
        },
      },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
