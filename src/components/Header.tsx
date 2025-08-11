import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Shield, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export const Header: React.FC = () => {
  const { isAuthenticated, logout, admin } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors">
            <Home className="h-8 w-8" />
            <span className="text-2xl font-bold">My-Rent</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <LanguageSelector />
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
              }`}
            >
              {t('nav.properties')}
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center space-x-1 font-medium transition-colors ${
                    isActive('/admin') ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>{t('nav.adminPanel')}</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{t('nav.welcome')}, {admin?.username}</span>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className={`font-medium transition-colors ${
                  isActive('/login') ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                {t('nav.adminLogin')}
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <div className="px-4">
                <LanguageSelector />
              </div>
              <Link
                to="/"
                className={`font-medium transition-colors ${
                  isActive('/') ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.properties')}
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-1 font-medium transition-colors ${
                      isActive('/admin') ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="h-4 w-4" />
                    <span>{t('nav.adminPanel')}</span>
                  </Link>
                  <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">{t('nav.welcome')}, {admin?.username}</span>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors self-start"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`font-medium transition-colors ${
                    isActive('/login') ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.adminLogin')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};