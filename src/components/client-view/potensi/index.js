"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Palmtree, ShoppingBag, Tractor, Beef, Building2, MapPin, History, MessageCircle, Facebook, Instagram, ExternalLink,Calendar } from 'lucide-react';

const SocialMediaIcons = ({ item }) => {
  const socialLinks = {
    shopee: item.shopee_link,
    facebook: item.facebook_link,
    instagram: item.instagram_link,
    whatsapp: item.whatsapp_link,
  };

  // Jangan render apa pun jika semua link kosong
  const isEmpty = Object.values(socialLinks).every((val) => !val);
  if (isEmpty) return null;

  return (
    <div className="flex gap-3 mt-4">
      {socialLinks.shopee && (
        <a
          href={socialLinks.shopee}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
        >
          <ShoppingBag className="w-5 h-5 text-white" />
        </a>
      )}
      {socialLinks.facebook && (
        <a
          href={socialLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
        >
          <Facebook className="w-5 h-5 text-white" />
        </a>
      )}
      {socialLinks.instagram && (
        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
        >
          <Instagram className="w-5 h-5 text-white" />
        </a>
      )}
      {socialLinks.whatsapp && (
        <a
          href={socialLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </a>
      )}
    </div>
  );
};

// Icon mapping for different categories
const getCategoryIcon = (kategori) => {
  switch (kategori?.toLowerCase()) {
    case 'wisata':
      return Palmtree;
    case 'pertanian':
      return Tractor;
    case 'peternakan':
      return Beef;
    case 'umkm':
      return ShoppingBag;
    case 'situs':
    case 'sejarah':
    case 'situs dan sejarah':
      return History;
    default:
      return Building2;
  }
};

export default function PotensiComponent() {
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const itemsPerPage = 6;

  // Base styles for container
  const baseStyles = {
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem',
    }
  };

  
  // Fetch JSON data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/potensi/get/');
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not valid JSON');
        }
        
        const data = await response.json();
        
        // Validasi struktur data yang lebih fleksibel
        if (!data) {
          throw new Error('Response data is null or undefined');
        }
        
        // Coba beberapa kemungkinan struktur data
        let potensiArray = null;
        if (data.potensi && Array.isArray(data.potensi)) {
          potensiArray = data.potensi;
        } else if (Array.isArray(data)) {
          potensiArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          potensiArray = data.data;
        } else if (data.result && Array.isArray(data.result)) {
          potensiArray = data.result;
        }
        
        if (!potensiArray) {
          throw new Error('Invalid data format: potensi array not found in response');
        }
        
        // Validasi bahwa array tidak kosong
        if (potensiArray.length === 0) {
          console.warn('Potensi array is empty');
        }
        
        // Pastikan setiap item memiliki properti yang diperlukan
        const validatedData = potensiArray.map((item, index) => ({
          id: item.id || item._id || index,
          nama: item.nama || 'Nama tidak tersedia',
          deskripsi: item.deskripsi || 'Deskripsi tidak tersedia',
          kategori: item.kategori || 'Lainnya',
          foto: item.foto || 'https://via.placeholder.com/400x300/10b981/ffffff?text=Foto+Tidak+Tersedia',
          tahun_mulai: item.tahun_mulai || 'Tidak diketahui',
          maps_link: item.maps_link || '',
          shopee_link: item.shopee_link || '',
          facebook_link: item.facebook_link || '',
          instagram_link: item.instagram_link || '',
          whatsapp_link: item.whatsapp_link || ''
        }));
        
        setContentData({
          potensi: validatedData
        });
        
      } catch (err) {
        console.error('Error fetching potensi data:', err);
        setError(`Gagal memuat data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle link click with alert
  const handleLinkClick = (item) => {
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-base font-medium">Memuat data potensi...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white border border-red-100 rounded-xl p-6 shadow-lg max-w-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal Memuat Data</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Check if data exists
  if (!contentData || !contentData.potensi || contentData.potensi.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl p-6 shadow-lg">
          <p className="text-gray-600 text-base font-medium">Data potensi tidak tersedia.</p>
        </div>
      </div>
    );
  }

  // Filter data berdasarkan kategori
  const filteredData = selectedCategory === 'Semua' 
    ? contentData.potensi 
    : contentData.potensi.filter(item => item.kategori === selectedCategory);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Get unique categories
  const categories = ['Semua', ...new Set(contentData.potensi.map(item => item.kategori))];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle link clicks to prevent event bubbling
  const handleSocialLinkClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', 
        color: 'white', 
        padding: '4rem 1rem',
        marginTop: '4rem'
      }}>
        <div style={baseStyles.container}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Potensi Desa Sumbersawit
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.25rem)', 
            color: '#bbf7d0', 
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            Jelajahi berbagai potensi unggulan Desa Sumbersawit dalam bidang wisata, pertanian, peternakan, dan UMKM
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filter */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex flex-wrap gap-2 bg-white-500 p-3 rounded-2xl shadow-lg border border-gray-100">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-green1-500 text-white-500 shadow-lg shadow-emerald-500/25'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Potensi Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {currentItems.map((item) => {
            const IconComponent = getCategoryIcon(item.kategori);
            
            return (
              <div 
                key={item.id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:scale-105 border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.foto}
                    alt={item.nama}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300/10b981/ffffff?text=Foto+Tidak+Tersedia';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute top-4 right-4">
                    <span className="bg-green1-500 text-white-500 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-emerald-500/25 transform hover:scale-105 transition-transform duration-200">
                      {item.kategori}
                    </span>
                  </div>
                  
                  {/* Icon overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-white-500 rounded-full flex items-center justify-center shadow-lg shadow-gray-500/20 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-green1-500" />
                    </div>
                  </div>

                  {/* Maps Button for each item */}
                  {item.maps_link && (
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={item.maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110"
                        onClick={handleSocialLinkClick}
                      >
                        <MapPin className="w-5 h-5 text-orange-500" />
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors duration-300 leading-tight">
                    {item.nama}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {item.deskripsi.length > 120 
                      ? `${item.deskripsi.substring(0, 120)}...` 
                      : item.deskripsi}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs text-orange-500 mb-4 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-xs text-black-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.tahun_mulai}
                    </span>   
                  </div>

                  {/* Social Media Preview for UMKM */}
                  {item.kategori?.toLowerCase() === 'umkm' && (
                    <div className="mb-4" onClick={handleSocialLinkClick}>
                      <div className="flex gap-2 flex-wrap">
                        {item.shopee_link && (
                          <a 
                            href={item.shopee_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-6 h-6 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors duration-200"
                          >
                            <ShoppingBag className="w-3 h-3 text-white-500" />
                          </a>
                        )}
                        {item.facebook_link && (
                          <a 
                            href={item.facebook_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-6 h-6 bg-blue-500 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200"
                          >
                            <Facebook className="w-3 h-3 text-white-500" />
                          </a>
                        )}
                        {item.instagram_link && (
                          <a 
                            href={item.instagram_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-6 h-6 bg-pink-500 hover:from-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center transition-colors duration-200"
                          >
                            <Instagram className="w-3 h-3 text-white-500" />
                          </a>
                        )}
                        {item.whatsapp_link && (
                          <a 
                            href={item.whatsapp_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-6 h-6 bg-green1-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-200"
                          >
                            <MessageCircle className="w-3 h-3 text-white-500" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                 {/* Baca Selengkapnya Button */}
                <div className="pt-3 border-t border-gray-100">
                  <Link
                    href={`/detailpotensi?id=${item.id || item._id}`}
                    onClick={() => handleLinkClick(item)}
                    className="w-full bg-green1-500 hover:bg-green1-500 text-white-500 font-semibold text-sm py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 mb-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                currentPage === 1
                  ? 'bg-gray-100 text-white cursor-not-allowed'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-md hover:shadow-lg'
              }`}
            >
              Sebelumnya
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  currentPage === page
                    ? 'bg-green1-500 text-white-500 shadow-lg shadow-emerald-500/25'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-md hover:shadow-lg'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-md hover:shadow-lg'
              }`}
            >
              Selanjutnya
            </button>
          </div>
        )}

        {/* Info Summary */}
        <div className="text-center bg-green1-500 rounded-xl p-4 shadow-lg border border-gray-100">
          <p className="text-sm text-white-500 font-medium">
            Menampilkan <span className="font-bold text-emerald-600">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> dari <span className="font-bold text-emerald-600">{filteredData.length}</span> potensi
            {selectedCategory !== 'Semua' && <span className="text-emerald-600 font-semibold"> ({selectedCategory})</span>}
          </p>
        </div>
      </div>
    </div>
  );
}