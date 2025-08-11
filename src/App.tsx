import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { PropertyDetail } from './pages/PropertyDetail';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <PropertyProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
              <Footer />
            </div>
          </Router>
        </PropertyProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;