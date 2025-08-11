import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Calendar } from 'lucide-react';
import { Property } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { language, t } = useLanguage();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatPaymentTerms = (terms: string) => {
    return t(`property.${terms}`);
  };

  const formatPropertyType = (type: string) => {
    return t(`type.${type}`);
  };

  return (
    <Link to={`/property/${property.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform group-hover:scale-[1.02]">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {formatPropertyType(property.type)}
          </div>
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
            {formatPrice(property.price)}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
            {property.title[language]}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {property.description[language]}
          </p>

          {/* Property Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-gray-600">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.rooms}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Bath className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bathrooms}</span>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">{formatPaymentTerms(property.paymentTerms)}</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              property.available 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {property.available ? t('property.available') : t('property.rented')}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};