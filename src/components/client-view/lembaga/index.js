"use client";

import { useState, useEffect } from 'react';

export default function LembagaComponent() {
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

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
    async function fetchData() {
      try {
        const response = await fetch('/data/lembaga.json');
        if (!response.ok) {
          throw new Error('Failed to fetch lembaga.json');
        }
        const data = await response.json();
        setContentData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const itemsPerPage = 6;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-base font-medium">Memuat lembaga...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white border border-red-100 rounded-xl p-6 shadow-md">
          <p className="text-red-600 text-base font-semibold">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Check if data exists
  if (!contentData || !contentData.lembaga) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl p-6 shadow-md">
          <p className="text-gray-600 text-base font-medium">Data lembaga tidak tersedia.</p>
        </div>
      </div>
    );
  }

  // Filter data berdasarkan kategori
  const filteredData = selectedCategory === 'Semua' 
    ? contentData.lembaga 
    : contentData.lembaga.filter(item => item.kategori === selectedCategory);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Get unique categories
  const categories = ['Semua', ...new Set(contentData.lembaga.map(item => item.kategori))];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            Lembaga Desa Sumbersawit
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.25rem)', 
            color: '#bbf7d0', 
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            Mengenal lebih dekat lembaga-lembaga yang berperan dalam pembangunan dan kegiatan sosial Desa Sumbersawit
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filter */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex flex-wrap gap-2 bg-white p-2 rounded-full shadow-sm">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Lembaga Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {currentItems.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.foto}
                  alt={item.nama}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {item.kategori}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.nama}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.deskripsi}
                </p>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Tahun Berdiri: {item.tahun_berdiri}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mb-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === 1
                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Sebelumnya
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === totalPages
                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Selanjutnya
            </button>
          </div>
        )}

        {/* Info Summary */}
        <div className="text-center text-sm text-gray-500 font-medium">
          Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} lembaga
          {selectedCategory !== 'Semua' && ` (${selectedCategory})`}
        </div>
      </div>
    </div>
  );
}