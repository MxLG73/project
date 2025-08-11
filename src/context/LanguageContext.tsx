import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.properties': 'Properties',
    'nav.adminPanel': 'Admin Panel',
    'nav.adminLogin': 'Admin Login',
    'nav.logout': 'Logout',
    'nav.welcome': 'Welcome',
    
    // Home Page
    'home.hero.title': 'Find Your Perfect Home',
    'home.hero.subtitle': 'Discover premium properties in prime locations',
    'home.hero.search': 'Search Properties',
    'home.available': 'Available Properties',
    'home.clearFilters': 'Clear Filters',
    'home.propertiesFound': 'properties found',
    'home.filter': 'Filter',
    'home.noProperties': 'No properties found',
    'home.noPropertiesDesc': 'Try adjusting your search filters to find more properties.',
    'home.modifySearch': 'Modify Search',
    
    // Property Details
    'property.rooms': 'Rooms',
    'property.bathrooms': 'Bathrooms',
    'property.monthly': 'Monthly',
    'property.3months': '3 Months',
    'property.6months': '6 Months',
    'property.12months': '12 Months',
    'property.terms': 'Terms',
    'property.description': 'Description',
    'property.features': 'Features',
    'property.lacks': 'What it lacks',
    'property.details': 'Property Details',
    'property.type': 'Property Type',
    'property.location': 'Location',
    'property.paymentTerms': 'Payment Terms',
    'property.available': 'Available',
    'property.rented': 'Rented',
    'property.notAvailable': 'Property Not Available',
    'property.contactWhatsApp': 'Contact via WhatsApp',
    'property.backToProperties': 'Back to Properties',
    
    // Property Types
    'type.apartment': 'Apartment',
    'type.house': 'House',
    'type.studio': 'Studio',
    'type.penthouse': 'Penthouse',
    
    // Search Modal
    'search.title': 'Search Properties',
    'search.location': 'Location',
    'search.locationPlaceholder': 'e.g., Downtown, Uptown, Arts District',
    'search.minPrice': 'Min Price ($)',
    'search.maxPrice': 'Max Price ($)',
    'search.minRooms': 'Minimum Rooms',
    'search.propertyType': 'Property Type',
    'search.paymentTerms': 'Payment Terms',
    'search.anyType': 'Any Type',
    'search.anyTerms': 'Any Terms',
    'search.anyRooms': 'Any',
    'search.searchProperties': 'Search Properties',
    'search.resetFilters': 'Reset Filters',
    
    // Admin
    'admin.title': 'Property Management',
    'admin.subtitle': 'Manage your real estate listings',
    'admin.addProperty': 'Add Property',
    'admin.syncData': 'Sync Data',
    'admin.syncing': 'Syncing...',
    'admin.searchProperties': 'Search properties...',
    'admin.editProperty': 'Edit Property',
    'admin.addNewProperty': 'Add New Property',
    
    // Login
    'login.title': 'Admin Login',
    'login.subtitle': 'Sign in to manage properties',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.signIn': 'Sign In',
    'login.signingIn': 'Signing in...',
    
    // Footer
    'footer.description': 'Your trusted partner in finding the perfect home. We specialize in premium properties in prime locations, offering exceptional service and expertise in real estate.',
    'footer.contactInfo': 'Contact Info',
    'footer.quickLinks': 'Quick Links',
    'footer.aboutUs': 'About Us',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.rightsReserved': 'All rights reserved.',
    'footer.designedWith': 'Designed with ❤️ for premium real estate'
  },
  ar: {
    // Navigation
    'nav.properties': 'العقارات',
    'nav.adminPanel': 'لوحة الإدارة',
    'nav.adminLogin': 'تسجيل دخول الإدارة',
    'nav.logout': 'تسجيل خروج',
    'nav.welcome': 'مرحباً',
    
    // Home Page
    'home.hero.title': 'اعثر على منزلك المثالي',
    'home.hero.subtitle': 'اكتشف العقارات المميزة في المواقع الرئيسية',
    'home.hero.search': 'البحث عن العقارات',
    'home.available': 'العقارات المتاحة',
    'home.clearFilters': 'مسح المرشحات',
    'home.propertiesFound': 'عقار موجود',
    'home.filter': 'تصفية',
    'home.noProperties': 'لم يتم العثور على عقارات',
    'home.noPropertiesDesc': 'حاول تعديل مرشحات البحث للعثور على المزيد من العقارات.',
    'home.modifySearch': 'تعديل البحث',
    
    // Property Details
    'property.rooms': 'الغرف',
    'property.bathrooms': 'الحمامات',
    'property.monthly': 'شهرياً',
    'property.3months': '3 أشهر',
    'property.6months': '6 أشهر',
    'property.12months': '12 شهر',
    'property.terms': 'الشروط',
    'property.description': 'الوصف',
    'property.features': 'المميزات',
    'property.lacks': 'ما ينقصه',
    'property.details': 'تفاصيل العقار',
    'property.type': 'نوع العقار',
    'property.location': 'الموقع',
    'property.paymentTerms': 'شروط الدفع',
    'property.available': 'متاح',
    'property.rented': 'مؤجر',
    'property.notAvailable': 'العقار غير متاح',
    'property.contactWhatsApp': 'التواصل عبر واتساب',
    'property.backToProperties': 'العودة للعقارات',
    
    // Property Types
    'type.apartment': 'شقة',
    'type.house': 'منزل',
    'type.studio': 'استوديو',
    'type.penthouse': 'بنتهاوس',
    
    // Search Modal
    'search.title': 'البحث عن العقارات',
    'search.location': 'الموقع',
    'search.locationPlaceholder': 'مثال: وسط المدينة، المنطقة الراقية',
    'search.minPrice': 'أقل سعر ($)',
    'search.maxPrice': 'أعلى سعر ($)',
    'search.minRooms': 'أقل عدد غرف',
    'search.propertyType': 'نوع العقار',
    'search.paymentTerms': 'شروط الدفع',
    'search.anyType': 'أي نوع',
    'search.anyTerms': 'أي شروط',
    'search.anyRooms': 'أي عدد',
    'search.searchProperties': 'البحث عن العقارات',
    'search.resetFilters': 'إعادة تعيين المرشحات',
    
    // Admin
    'admin.title': 'إدارة العقارات',
    'admin.subtitle': 'إدارة قوائم العقارات الخاصة بك',
    'admin.addProperty': 'إضافة عقار',
    'admin.syncData': 'مزامنة البيانات',
    'admin.syncing': 'جاري المزامنة...',
    'admin.searchProperties': 'البحث عن العقارات...',
    'admin.editProperty': 'تعديل العقار',
    'admin.addNewProperty': 'إضافة عقار جديد',
    
    // Login
    'login.title': 'تسجيل دخول الإدارة',
    'login.subtitle': 'سجل دخولك لإدارة العقارات',
    'login.username': 'اسم المستخدم',
    'login.password': 'كلمة المرور',
    'login.signIn': 'تسجيل الدخول',
    'login.signingIn': 'جاري تسجيل الدخول...',
    
    // Footer
    'footer.description': 'شريكك الموثوق في العثور على المنزل المثالي. نحن متخصصون في العقارات المميزة في المواقع الرئيسية، ونقدم خدمة استثنائية وخبرة في العقارات.',
    'footer.contactInfo': 'معلومات الاتصال',
    'footer.quickLinks': 'روابط سريعة',
    'footer.aboutUs': 'من نحن',
    'footer.privacyPolicy': 'سياسة الخصوصية',
    'footer.rightsReserved': 'جميع الحقوق محفوظة.',
    'footer.designedWith': 'مصمم بـ ❤️ للعقارات المميزة'
  },
  tr: {
    // Navigation
    'nav.properties': 'Emlaklar',
    'nav.adminPanel': 'Yönetici Paneli',
    'nav.adminLogin': 'Yönetici Girişi',
    'nav.logout': 'Çıkış',
    'nav.welcome': 'Hoş geldiniz',
    
    // Home Page
    'home.hero.title': 'Mükemmel Evinizi Bulun',
    'home.hero.subtitle': 'Birinci sınıf konumlarda premium emlakları keşfedin',
    'home.hero.search': 'Emlak Ara',
    'home.available': 'Mevcut Emlaklar',
    'home.clearFilters': 'Filtreleri Temizle',
    'home.propertiesFound': 'emlak bulundu',
    'home.filter': 'Filtrele',
    'home.noProperties': 'Emlak bulunamadı',
    'home.noPropertiesDesc': 'Daha fazla emlak bulmak için arama filtrelerinizi ayarlamayı deneyin.',
    'home.modifySearch': 'Aramayı Değiştir',
    
    // Property Details
    'property.rooms': 'Odalar',
    'property.bathrooms': 'Banyolar',
    'property.monthly': 'Aylık',
    'property.3months': '3 Ay',
    'property.6months': '6 Ay',
    'property.12months': '12 Ay',
    'property.terms': 'Şartlar',
    'property.description': 'Açıklama',
    'property.features': 'Özellikler',
    'property.lacks': 'Eksikleri',
    'property.details': 'Emlak Detayları',
    'property.type': 'Emlak Türü',
    'property.location': 'Konum',
    'property.paymentTerms': 'Ödeme Şartları',
    'property.available': 'Mevcut',
    'property.rented': 'Kiralandı',
    'property.notAvailable': 'Emlak Mevcut Değil',
    'property.contactWhatsApp': 'WhatsApp ile İletişim',
    'property.backToProperties': 'Emlaklar\'a Dön',
    
    // Property Types
    'type.apartment': 'Daire',
    'type.house': 'Ev',
    'type.studio': 'Stüdyo',
    'type.penthouse': 'Çatı Katı',
    
    // Search Modal
    'search.title': 'Emlak Ara',
    'search.location': 'Konum',
    'search.locationPlaceholder': 'örn: Şehir Merkezi, Üst Mahalle',
    'search.minPrice': 'Min Fiyat ($)',
    'search.maxPrice': 'Max Fiyat ($)',
    'search.minRooms': 'Minimum Oda',
    'search.propertyType': 'Emlak Türü',
    'search.paymentTerms': 'Ödeme Şartları',
    'search.anyType': 'Herhangi Bir Tür',
    'search.anyTerms': 'Herhangi Bir Şart',
    'search.anyRooms': 'Herhangi',
    'search.searchProperties': 'Emlak Ara',
    'search.resetFilters': 'Filtreleri Sıfırla',
    
    // Admin
    'admin.title': 'Emlak Yönetimi',
    'admin.subtitle': 'Emlak listelerinizi yönetin',
    'admin.addProperty': 'Emlak Ekle',
    'admin.syncData': 'Veri Senkronize Et',
    'admin.syncing': 'Senkronize ediliyor...',
    'admin.searchProperties': 'Emlak ara...',
    'admin.editProperty': 'Emlak Düzenle',
    'admin.addNewProperty': 'Yeni Emlak Ekle',
    
    // Login
    'login.title': 'Yönetici Girişi',
    'login.subtitle': 'Emlakları yönetmek için giriş yapın',
    'login.username': 'Kullanıcı Adı',
    'login.password': 'Şifre',
    'login.signIn': 'Giriş Yap',
    'login.signingIn': 'Giriş yapılıyor...',
    
    // Footer
    'footer.description': 'Mükemmel evi bulmanızda güvenilir ortağınız. Birinci sınıf konumlarda premium emlaklar konusunda uzmanız, olağanüstü hizmet ve emlak uzmanlığı sunuyoruz.',
    'footer.contactInfo': 'İletişim Bilgileri',
    'footer.quickLinks': 'Hızlı Bağlantılar',
    'footer.aboutUs': 'Hakkımızda',
    'footer.privacyPolicy': 'Gizlilik Politikası',
    'footer.rightsReserved': 'Tüm hakları saklıdır.',
    'footer.designedWith': 'Premium emlak için ❤️ ile tasarlandı'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};