import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Property } from '../types';

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => Promise<void>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  getProperty: (id: string) => Property | undefined;
  syncData: () => Promise<void>;
  loading: boolean;
  uploadImage: (file: File) => Promise<string>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: {
      en: 'Modern Downtown Apartment',
      ar: 'شقة عصرية في وسط المدينة',
      tr: 'Modern Şehir Merkezi Dairesi'
    },
    description: {
      en: 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views and modern amenities.',
      ar: 'شقة جميلة من غرفتي نوم في قلب وسط المدينة مع إطلالات خلابة على المدينة ووسائل راحة عصرية.',
      tr: 'Şehir merkezinin kalbinde muhteşem şehir manzaralı ve modern olanaklara sahip güzel 2 yatak odalı daire.'
    },
    price: 2500,
    location: 'Downtown',
    rooms: 2,
    bathrooms: 2,
    type: 'apartment',
    paymentTerms: 'monthly',
    images: [
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
    ],
    features: ['Parking', 'Gym', 'Pool', 'Balcony', 'Air Conditioning'],
    lacks: ['Garden', 'Storage Room'],
    available: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: {
      en: 'Luxury Penthouse Suite',
      ar: 'جناح بنتهاوس فاخر',
      tr: 'Lüks Çatı Katı Süiti'
    },
    description: {
      en: 'Exclusive penthouse with panoramic views, private terrace, and premium finishes throughout.',
      ar: 'بنتهاوس حصري مع إطلالات بانورامية وتراس خاص ولمسات نهائية فاخرة في جميع أنحاء المكان.',
      tr: 'Panoramik manzaralı, özel teraslı ve her yerde premium bitişli özel çatı katı.'
    },
    price: 4800,
    location: 'Uptown',
    rooms: 3,
    bathrooms: 3,
    type: 'penthouse',
    paymentTerms: 'monthly',
    images: [
      'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg',
      'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg'
    ],
    features: ['Private Terrace', 'Concierge', 'Valet', 'Wine Cellar', 'Smart Home'],
    lacks: ['Pet Area'],
    available: true,
    createdAt: new Date('2024-01-20')
  }
];

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    syncData();
  }, []);

  const syncData = async () => {
    setLoading(true);
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Fallback to localStorage if Supabase is not configured
        const savedProperties = localStorage.getItem('primehomes_properties_global');
        if (savedProperties) {
          const parsed = JSON.parse(savedProperties);
          setProperties(parsed.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })));
        } else {
          setProperties(MOCK_PROPERTIES);
          localStorage.setItem('primehomes_properties_global', JSON.stringify(MOCK_PROPERTIES));
        }
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        // Fallback to localStorage
        const savedProperties = localStorage.getItem('primehomes_properties_global');
        if (savedProperties) {
          const parsed = JSON.parse(savedProperties);
          setProperties(parsed.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })));
        } else {
          setProperties(MOCK_PROPERTIES);
        }
      } else {
        const formattedProperties = data.map(property => ({
          ...property,
          createdAt: new Date(property.created_at)
        }));
        setProperties(formattedProperties);
        // Also save to localStorage as backup
        localStorage.setItem('primehomes_properties_global', JSON.stringify(formattedProperties));
      }
    } catch (error) {
      console.error('Error syncing data:', error);
      // Fallback to localStorage
      const savedProperties = localStorage.getItem('primehomes_properties_global');
      if (savedProperties) {
        const parsed = JSON.parse(savedProperties);
        setProperties(parsed.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })));
      } else {
        setProperties(MOCK_PROPERTIES);
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Fallback: convert to base64 for local storage
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `property-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      // Fallback: convert to base64
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  };

  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const newProperty: Property = {
        ...propertyData,
        id: Date.now().toString(),
        createdAt: new Date()
      };

      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Fallback to localStorage
        const newProperties = [...properties, newProperty];
        setProperties(newProperties);
        localStorage.setItem('primehomes_properties_global', JSON.stringify(newProperties));
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('properties')
        .insert([{
          id: newProperty.id,
          title: newProperty.title,
          description: newProperty.description,
          price: newProperty.price,
          location: newProperty.location,
          rooms: newProperty.rooms,
          bathrooms: newProperty.bathrooms,
          type: newProperty.type,
          payment_terms: newProperty.paymentTerms,
          images: newProperty.images,
          features: newProperty.features,
          lacks: newProperty.lacks,
          available: newProperty.available,
          created_at: newProperty.createdAt.toISOString()
        }]);

      if (error) {
        throw error;
      }

      await syncData();
    } catch (error) {
      console.error('Error adding property:', error);
      // Fallback to localStorage
      const newProperty: Property = {
        ...propertyData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      const newProperties = [...properties, newProperty];
      setProperties(newProperties);
      localStorage.setItem('primehomes_properties_global', JSON.stringify(newProperties));
    } finally {
      setLoading(false);
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    setLoading(true);
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Fallback to localStorage
        const newProperties = properties.map(property =>
          property.id === id ? { ...property, ...updates } : property
        );
        setProperties(newProperties);
        localStorage.setItem('primehomes_properties_global', JSON.stringify(newProperties));
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('properties')
        .update({
          title: updates.title,
          description: updates.description,
          price: updates.price,
          location: updates.location,
          rooms: updates.rooms,
          bathrooms: updates.bathrooms,
          type: updates.type,
          payment_terms: updates.paymentTerms,
          images: updates.images,
          features: updates.features,
          lacks: updates.lacks,
          available: updates.available
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      await syncData();
    } catch (error) {
      console.error('Error updating property:', error);
      // Fallback to localStorage
      const newProperties = properties.map(property =>
        property.id === id ? { ...property, ...updates } : property
      );
      setProperties(newProperties);
      localStorage.setItem('primehomes_properties_global', JSON.stringify(newProperties));
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id: string) => {
    setLoading(true);
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Fallback to localStorage
        const newProperties = properties.filter(property => property.id !== id);
        setProperties(newProperties);
        localStorage.setItem('primehomes_properties_global', JSON.stringify(newProperties));
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await syncData();
    } catch (error) {
      console.error('Error deleting property:', error);
      // Fallback to localStorage
      const newProperties = properties.filter(property => property.id !== id);
      setProperties(newProperties);
      localStorage.setItem('primehomes_properties_global', JSON.stringify(newProperties));
    } finally {
      setLoading(false);
    }
  };

  const getProperty = (id: string) => {
    return properties.find(property => property.id === id);
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      addProperty,
      updateProperty,
      deleteProperty,
      getProperty,
      syncData,
      loading,
      uploadImage
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};