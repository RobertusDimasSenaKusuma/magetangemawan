"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Users, Heart, BookOpen, Calendar, ArrowLeft, Clock, MapPin } from 'lucide-react';

// Icon mapping for different categories
const getCategoryIcon = (kategori) => {
  switch (kategori?.toLowerCase()) {
    case 'sosial':
      return Users;
    case 'keagamaan':
      return BookOpen;
    case 'pendidikan':
      return BookOpen;
    case 'kesehatan':
      return Heart;
    case 'olahraga':
      return Users;
    case 'budaya':
      return Building2;
    case 'ekonomi':
      return Building2;
    default:
      return Calendar;
  }
};

// Simple image component to replace Next.js Image
const SimpleImage = ({ src, alt, className, onError }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    if (onError) onError();
  };

  // Fix relative paths
  const fixedSrc = imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/') 
    ? `/${imgSrc}` 
    : imgSrc;

  if (hasError || !fixedSrc) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-400">Foto tidak tersedia</span>
      </div>
    );
  }

  return (
    <img
      src={fixedSrc}
      alt={alt}
      className={className}
      onError={handleError}
      style={{ objectFit: 'cover' }}
    />
  );
};

export default function DetailKegiatanPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [kegiatan, setKegiatan] = useState(null);
  const [relatedKegiatan, setRelatedKegiatan] = useState([]);
  const [sameCategory, setSameCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (id) {
      fetchKegiatanDetail(id);
    } else {
      setError('ID kegiatan tidak ditemukan');
      setLoading(false);
    }
  }, [id]);

  const fetchKegiatanDetail = async (kegiatanId) => {
    try {
      setLoading(true);
      
      console.log('Fetching kegiatan with ID:', kegiatanId);
      
      // Fetch data from kegiatan.json
      const response = await fetch('/data/kegiatan.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);
      
      // Check if data structure is correct
      if (!data || !data.kegiatan || !Array.isArray(data.kegiatan)) {
        console.error('Invalid data structure:', data);
        throw new Error('Data kegiatan tidak valid atau tidak ditemukan');
      }
      
      console.log('Available kegiatan:', data.kegiatan);
      
      // Fixed ID comparison to handle large numbers properly
      // Convert both IDs to strings for safe comparison
      const foundKegiatan = data.kegiatan.find(item => {
        const itemId = String(item.id);
        const searchId = String(kegiatanId);
        console.log('Comparing:', itemId, 'with', searchId);
        return itemId === searchId;
      });
      
      console.log('Found kegiatan:', foundKegiatan);
      
      if (!foundKegiatan) {
        throw new Error(`Kegiatan dengan ID ${kegiatanId} tidak ditemukan`);
      }
      
      setKegiatan(foundKegiatan);
      
      // Get related kegiatan (different categories only) for sidebar
      const related = data.kegiatan
        .filter(item => 
          String(item.id) !== String(foundKegiatan.id) &&
          item.kategori?.toLowerCase() !== foundKegiatan.kategori?.toLowerCase()
        )
        .slice(0, 6);
      
      setRelatedKegiatan(related);

      // Get all kegiatan with same category (no limit for pagination)
      const sameCategoryItems = data.kegiatan
        .filter(item => 
          String(item.id) !== String(foundKegiatan.id) &&
          item.kategori?.toLowerCase() === foundKegiatan.kategori?.toLowerCase()
        );
      
      setSameCategory(sameCategoryItems);
      
    } catch (err) {
      console.error('Error fetching kegiatan:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Pagination calculations
  const totalPages = Math.ceil(sameCategory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sameCategory.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to same category section
    document.getElementById('same-category-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!kegiatan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Kegiatan Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-4">Kegiatan yang Anda cari tidak dapat ditemukan.</p>
        </div>
      </div>
    );
  }

  const IconComponent = getCategoryIcon(kegiatan.kategori);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Info - Remove this in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 p-2 text-xs">
          <p>Debug: ID = {id}, Kegiatan = {kegiatan?.nama}</p>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              
              {/* Category Info and Stats */}
              <div className="p-4 md:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                   {/* left side - Back button */}
                  <Link 
                    href="/kegiatan" 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                  </Link>
                  
                  {/* right side - Category Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-green1-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green1-500 text-sm md:text-base">
                        {kegiatan.kategori || 'Kategori'}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative h-64 md:h-96 lg:h-[500px] w-full">
                <SimpleImage
                  src={kegiatan.foto}
                  alt={kegiatan.nama || "Kegiatan image"}
                  className="w-full h-full"
                  onError={() => {
                    console.error('Image failed to load:', kegiatan.foto);
                  }}
                />
              </div>

              {/* Article Body */}
              <div className="p-4 md:p-6">
                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-3 leading-tight">
                  {kegiatan.nama || "Nama Kegiatan"}
                </h1>

               {/* Info Cards */}
                <div className="grid grid-cols-1 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-4">
                    <Calendar className="w-6 h-6 text-orange-500" />
                    <div>
                    <p className="font-semibold text-sm text-gray-600">Tahun {kegiatan.tahun || "Tahun tidak tersedia"} </p>
                    </div>
                </div>
                </div>
                {/* Article Content */}
                <div className="prose prose-base md:prose-lg max-w-none mt-1">
                  <div className="text-gray-700 leading-relaxed space-y-4 text-justify">
                    <p className="text-sm md:text-base">
                      {kegiatan.deskripsi || "Deskripsi kegiatan akan ditampilkan di sini."}
                    </p>
                  </div>
                </div>

                {/* Share Section */}
                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Bagikan Kegiatan:</h3>
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: kegiatan.nama,
                            url: window.location.href
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link telah disalin!');
                        }
                      }}
                      className="bg-green1-500 text-white-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
                    >
                      <span>📤</span>
                      <span>Bagikan</span>
                    </button>
                  </div>
                </div>

                {/* Same Category Articles with Pagination */}
                {sameCategory.length > 0 && (
                  <div id="same-category-section" className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <h3 className="text-lg md:text-xl font-bold text-gray-800">
                        Kegiatan {kegiatan.kategori} Lainnya
                      </h3>
                      <span className="text-sm text-gray-500">
                        {sameCategory.length} kegiatan
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      {currentItems.map((item, index) => {
                        const ItemIcon = getCategoryIcon(item.kategori);
                        return (
                          <div 
                            key={String(item.id) || index}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                          >
                            <div className="relative h-40 md:h-48 w-full overflow-hidden">
                              <SimpleImage
                                src={item.foto}
                                alt={item.nama || "Kegiatan image"}
                                className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                                onError={() => {
                                  console.error('Image failed to load:', item.foto);
                                }}
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <ItemIcon className="w-4 h-4 text-green1-500" />
                                <span className="text-xs text-blue-500">{item.kategori}</span>
                              </div>
                              <h4 className="font-bold text-gray-800 mb-2 text-sm md:text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {item.nama || "Kegiatan Terkait"}
                              </h4>
                              <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">
                                {truncateText(item.deskripsi, 80)}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-black-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {item.tahun}
                                </span>
                                <Link 
                                  href={`/detailkegiatan?id=${item.id}`}
                                  className="bg-green1-500 hover:bg-blue-600 text-white-500 text-xs px-6 py-2 rounded-full transition-colors font-medium"
                                >
                                  Lihat Detail
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center mt-6 space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                            currentPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:shadow-lg'
                          }`}
                        >
                          ← Prev
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                              currentPage === pageNumber
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:shadow-lg'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                            currentPage === totalPages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:shadow-lg'
                          }`}
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>

            {/* Related Kegiatan on Mobile */}
            <div className="lg:hidden mt-8">
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Kegiatan Lainnya</h3>
                <div className="space-y-4">
                  {relatedKegiatan.length > 0 ? (
                    relatedKegiatan.slice(0, 4).map((item, index) => {
                      const ItemIcon = getCategoryIcon(item.kategori);
                      return (
                        <div 
                          key={String(item.id) || index}
                          className="flex gap-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group p-4"
                        >
                          {/* Small Image */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden">
                              <SimpleImage
                                src={item.foto}
                                alt={item.nama || "Kegiatan image"}
                                className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                                onError={() => {
                                  console.error('Image failed to load:', item.foto);
                                }}
                              />
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <ItemIcon className="w-3 h-3 text-green1-500" />
                              <span className="text-xs text-blue-500">{item.kategori}</span>
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm md:text-base group-hover:text-blue-600 transition-colors">
                              {item.nama || "Kegiatan Lainnya"}
                            </h4>
                            <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">
                              {truncateText(item.deskripsi, 80)}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-black-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {item.tahun}
                              </span>
                              <Link 
                                href={`/detailkegiatan?id=${item.id}`}
                                className="bg-green1-500 hover:bg-blue-600 text-white-500 text-xs px-3 py-1 rounded-full transition-colors font-medium"
                              >
                                Lihat Detail
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Tidak ada kegiatan lain yang tersedia
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
           <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-8 space-y-6 mt-8">
              {/* Related Kegiatan */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Kegiatan Lainnya</h3>
                <div className="space-y-4">
                  {relatedKegiatan.length > 0 ? (
                    relatedKegiatan.slice(0, 5).map((item, index) => {
                      const ItemIcon = getCategoryIcon(item.kategori);
                      return (
                        <div 
                          key={String(item.id) || index}
                          className="flex gap-3 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group p-3"
                        >
                          {/* Small Image */}
                          <div className="flex-shrink-0">
                            <div className="w-14 h-14 rounded-lg overflow-hidden">
                              <SimpleImage
                                src={item.foto}
                                alt={item.nama || "Kegiatan image"}
                                className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                                onError={() => {
                                  console.error('Image failed to load:', item.foto);
                                }}
                              />
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <ItemIcon className="w-3 h-3 text-green1-500" />
                              <span className="text-xs text-blue-500">{item.kategori}</span>
                            </div>
                            <h4 className="font-medium text-gray-800 mb-1 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {item.nama || "Kegiatan Lainnya"}
                            </h4>
                            <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                              {truncateText(item.deskripsi, 50)}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-black-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {item.tahun}
                              </span>
                              <Link 
                                href={`/detailkegiatan?id=${item.id}`}
                                className="bg-green1-500 hover:bg-blue-600 text-white-500 text-xs px-3 py-1 rounded-full transition-colors font-medium"
                              >
                                Detail
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Tidak ada kegiatan lain yang tersedia
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}