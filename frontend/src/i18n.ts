import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          shop_title: 'Shop',
          add_to_cart: 'Add to Cart',
        },
      },
      es: {
        translation: {
          shop_title: 'Tienda',
          add_to_cart: 'Agregar al carrito',
        },
      },
    },
    lng: 'es', // idioma por defecto
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
