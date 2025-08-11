import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useLanguage } from '../context/LanguageContext';
import { Property } from '../types';

interface PropertyFormProps {
  property?: Property | null;
  onClose: () => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ property, onClose }) => {
  const { addProperty, updateProperty, uploadImage } = useProperties();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: { en: '', ar: '', tr: '' },
    description: { en: '', ar: '', tr: '' },
    price: 0,
    location: '',
    rooms: 0,
    bathrooms: 1,
    type: 'apartment' as const,
    paymentTerms: 'monthly' as const,
    images: [''],
    features: [''],
    lacks: [''],
    available: true
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description,
        price: property.price,
        location: property.location,
        rooms: property.rooms,
        bathrooms: property.bathrooms,
        type: property.type,
        paymentTerms: property.paymentTerms,
        images: property.images || [''],
        features: property.features || [''],
        lacks: property.lacks || [''],
        available: property.available
      });
    }
  }, [property]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanedData = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== ''),
      features: formData.features.filter(feature => feature.trim() !== ''),
      lacks: formData.lacks.filter(lack => lack.trim() !== '')
    };

    if (property) {
      updateProperty(property.id, cleanedData);
    } else {
      addProperty(cleanedData);
    }
    
    onClose();
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      handleImageChange(index, imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length ? newImages : [''] });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeatureField = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeatureField = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length ? newFeatures : [''] });
  };

  const handleLackChange = (index: number, value: string) => {
    const newLacks = [...formData.lacks];
    newLacks[index] = value;
    setFormData({ ...formData, lacks: newLacks });
  };

  const addLackField = () => {
    setFormData({ ...formData, lacks: [...formData.lacks, ''] });
  };

  const removeLackField = (index: number) => {
    const newLacks = formData.lacks.filter((_, i) => i !== index);
    setFormData({ ...formData, lacks: newLacks.length ? newLacks : [''] });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {property ? t('admin.editProperty') : t('admin.addNewProperty')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Multi-language Titles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Property Title (All Languages) *
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">English</label>
                <input
                  type="text"
                  required
                  value={formData.title.en}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Enter English title"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">العربية</label>
                <input
                  type="text"
                  required
                  value={formData.title.ar}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="أدخل العنوان بالعربية"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Türkçe</label>
                <input
                  type="text"
                  required
                  value={formData.title.tr}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, tr: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Türkçe başlık girin"
                />
              </div>
            </div>
          </div>

          {/* Multi-language Descriptions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Description (All Languages) *
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">English</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description.en}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Enter English description"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">العربية</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description.ar}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, ar: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="أدخل الوصف بالعربية"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Türkçe</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description.tr}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, tr: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Türkçe açıklama girin"
                />
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter location"
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rooms *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Type and Payment Terms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="studio">Studio</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Terms *
              </label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="monthly">Monthly</option>
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="12months">12 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability *
              </label>
              <select
                value={formData.available.toString()}
                onChange={(e) => setFormData({ ...formData, available: e.target.value === 'true' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="true">Available</option>
                <option value="false">Rented</option>
              </select>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Images
            </label>
            <div className="space-y-3">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="https://example.com/image.jpg or upload file"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">or</span>
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(index, file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="p-3 text-red-600 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                disabled={uploading}
                className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>{uploading ? 'Uploading...' : 'Add Another Image'}</span>
              </button>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Features
            </label>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="e.g., Parking, Pool, Gym"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeatureField(index)}
                      className="p-3 text-red-600 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeatureField}
                className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Add Feature</span>
              </button>
            </div>
          </div>

          {/* Lacks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What the Property Lacks
            </label>
            <div className="space-y-3">
              {formData.lacks.map((lack, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={lack}
                    onChange={(e) => handleLackChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="e.g., Garden, Storage Room, Elevator"
                  />
                  {formData.lacks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLackField(index)}
                      className="p-3 text-red-600 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLackField}
                className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Add Lack</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
            >
              {uploading ? 'Processing...' : (property ? 'Update Property' : 'Add Property')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};