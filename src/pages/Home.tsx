import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { SearchModal } from '../components/SearchModal';
import { useProperties } from '../context/PropertyContext';
import { SearchFilters } from '../types';

export const Home: React.FC = () => {
  const { properties } = useProperties();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    location: '',
    minPrice: 0,
    maxPrice: 10000,
    rooms: 0,
    paymentTerms: '',
    type: ''
  });
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      if (!property.available) return false;

      // Location filter
      if (currentFilters.location && 
          !property.location.toLowerCase().includes(currentFilters.location.toLowerCase())) {
        return false;
      }

      // Price filter
      if (property.price < currentFilters.minPrice || property.price > currentFilters.maxPrice) {
        return false;
      }

      // Rooms filter
      if (currentFilters.rooms > 0 && property.rooms < currentFilters.rooms) {
        return false;
      }

      // Payment terms filter
      if (currentFilters.paymentTerms && property.paymentTerms !== currentFilters.paymentTerms) {
        return false;
      }

      // Property type filter
      if (currentFilters.type && property.type !== currentFilters.type) {
        return false;
      }

      return true;
    });
  }, [properties, currentFilters]);

  const handleSearch = (filters: SearchFilters) => {
    setCurrentFilters(filters);
    const hasFilters = filters.location !== '' || 
                      filters.minPrice > 0 || 
                      filters.maxPrice < 10000 ||
                      filters.rooms > 0 ||
                      filters.paymentTerms !== '' ||
                      filters.type !== '';
    setHasActiveFilters(hasFilters);
  };

  const clearFilters = () => {
    setCurrentFilters({
      location: '',
      minPrice: 0,
      maxPrice: 10000,
      rooms: 0,
      paymentTerms: '',
      type: ''
    });
    setHasActiveFilters(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Home
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-emerald-100">
              Discover premium properties in prime locations
            </p>
            <button
              onClick={() => setSearchModalOpen(true)}
              className="bg-white text-emerald-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center space-x-2 shadow-lg"
            >
              <Search className="h-6 w-6" />
              <span>Search Properties</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Properties
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {filteredProperties.length} properties found
            </span>
            <button
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search filters to find more properties.</p>
            <button
              onClick={() => setSearchModalOpen(true)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Modify Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSearch={handleSearch}
      />
    </div>
  );
};