export interface Property {
  id: string;
  title: {
    en: string;
    ar: string;
    tr: string;
  };
  description: {
    en: string;
    ar: string;
    tr: string;
  };
  price: number;
  location: string;
  rooms: number;
  bathrooms: number;
  type: 'apartment' | 'house' | 'studio' | 'penthouse';
  paymentTerms: 'monthly' | '3months' | '6months' | '12months';
  images: string[];
  features: string[];
  lacks: string[];
  available: boolean;
  createdAt: Date;
}

export interface SearchFilters {
  location: string;
  minPrice: number;
  maxPrice: number;
  rooms: number;
  paymentTerms: string;
  type: string;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
}

export type Language = 'en' | 'ar' | 'tr';