export interface Product {
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
