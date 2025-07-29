"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Palmtree, ShoppingBag, Tractor, Beef, MapPin, Facebook, Instagram, MessageCircle, ArrowLeft, History} from 'lucide-react';

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
        <span className="text-gray-400 text-sm">Foto tidak tersedia</span>
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

export default function DetailPotensiPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [potensi, setPotensi] = useState(null);
  const [relatedPotensi, setRelatedPotensi] = useState([]);
  const [sameCategory, setSameCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (id) {
      fetchPotensiDetail(id);
    } else {
      setError('ID potensi tidak ditemukan');
      setLoading(false);
    }
  }, [id]);

  const fetchPotensiDetail = async (potensiId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching potensi with ID:', potensiId);
      
      // Fetch data from API
      const response = await fetch('/api/potensi/get/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response Error:', response.status, errorText);
        throw new Error(`Gagal mengambil data: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Full API Response:', data);
      
      // Handle different possible data structures
      let potensiArray = [];
      
      if (data.potensi && Array.isArray(data.potensi)) {
        potensiArray = data.potensi;
      } else if (data.data && Array.isArray(data.data)) {
        potensiArray = data.data;
      } else if (Array.isArray(data)) {
        potensiArray = data;
      } else if (data.result && Array.isArray(data.result)) {
        potensiArray = data.result;
      } else {
        console.error('Unexpected data structure:', data);
        throw new Error('Format data tidak sesuai - tidak ditemukan array potensi');
      }
      
      console.log('Potensi array length:', potensiArray.length);
      console.log('Available potensi IDs:', potensiArray.map(item => ({ 
        id: item.id || item._id, 
        nama: item.nama 
      })));
      
      // Enhanced ID comparison - check both id and _id fields
      const foundPotensi = potensiArray.find(item => {
        const itemId = item.id || item._id;
        const matchesId = itemId == potensiId;
        const matchesIdStrict = String(itemId) === String(potensiId);
        
        console.log(`Comparing: ${itemId} with ${potensiId} - loose: ${matchesId}, strict: ${matchesIdStrict}`);
        
        return matchesId || matchesIdStrict;
      });
      
      console.log('Found potensi:', foundPotensi);
      
      if (!foundPotensi) {
        console.error(`Potensi dengan ID ${potensiId} tidak ditemukan`);
        console.error('Available IDs in data:', potensiArray.map(p => p.id || p._id));
        throw new Error(`Potensi dengan ID ${potensiId} tidak ditemukan`);
      }
      
      // Normalize the found potensi data
      const normalizedPotensi = {
        id: foundPotensi.id || foundPotensi._id,
        nama: foundPotensi.nama || 'Nama tidak tersedia',
        deskripsi: foundPotensi.deskripsi || 'Deskripsi tidak tersedia',
        kategori: foundPotensi.kategori || 'Lainnya',
        foto: foundPotensi.foto || 'https://via.placeholder.com/400x300/10b981/ffffff?text=Foto+Tidak+Tersedia',
        tahun_mulai: foundPotensi.tahun_mulai || 'Tidak diketahui',
        lokasi: foundPotensi.lokasi || 'Desa Sumbersawit',
        maps_link: foundPotensi.maps_link || '',
        shopee_link: foundPotensi.shopee_link || '',
        facebook_link: foundPotensi.facebook_link || '',
        instagram_link: foundPotensi.instagram_link || '',
        whatsapp_link: foundPotensi.whatsapp_link || ''
      };
      
      setPotensi(normalizedPotensi);
      
      // Get related potensi (different categories only)
      const related = potensiArray
        .filter(item => {
          const itemId = item.id || item._id;
          return itemId != normalizedPotensi.id &&
                 item.kategori?.toLowerCase() !== normalizedPotensi.kategori?.toLowerCase();
        })
        .slice(0, 6)
        .map(item => ({
          id: item.id || item._id,
          nama: item.nama || 'Nama tidak tersedia',
          deskripsi: item.deskripsi || 'Deskripsi tidak tersedia',
          kategori: item.kategori || 'Lainnya',
          foto: item.foto || 'https://via.placeholder.com/400x300/10b981/ffffff?text=Foto+Tidak+Tersedia'
        }));
      
      setRelatedPotensi(related);

      // Get same category potensi
      const sameCategoryItems = potensiArray
        .filter(item => {
          const itemId = item.id || item._id;
          return itemId != normalizedPotensi.id &&
                 item.kategori?.toLowerCase() === normalizedPotensi.kategori?.toLowerCase();
        })
        .map(item => ({
          id: item.id || item._id,
          nama: item.nama || 'Nama tidak tersedia',
          deskripsi: item.deskripsi || 'Deskripsi tidak tersedia',
          kategori: item.kategori || 'Lainnya',
          foto: item.foto || 'https://via.placeholder.com/400x300/10b981/ffffff?text=Foto+Tidak+Tersedia'
        }));
      
      setSameCategory(sameCategoryItems);
      
      console.log('Related potensi:', related.length);
      console.log('Same category potensi:', sameCategoryItems.length);
      
    } catch (err) {
      console.error('Error fetching potensi:', err);
      setError(err.message || 'Terjadi kesalahan saat mengambil data');
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
    document.getElementById('same-category-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleRetry = () => {
    if (id) {
      fetchPotensiDetail(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data potensi...</p>
         
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h1>
          <p className="text-gray-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500 mb-6">ID yang dicari: {id}</p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Coba Lagi
            </button>
            <Link 
              href="/potensi" 
              className="block w-full bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors text-center"
            >
              Kembali ke Daftar Potensi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!potensi) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Potensi Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-2">Potensi yang Anda cari tidak dapat ditemukan.</p>
          <p className="text-sm text-gray-500 mb-4">ID: {id}</p>
          <Link 
            href="/potensi" 
            className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Kembali ke Daftar Potensi
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = getCategoryIcon(potensi.kategori);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Info - Remove this in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 p-2 text-xs">
          <p>Debug: URL ID = {id}, Found ID = {potensi?.id}, Nama = {potensi?.nama}, Kategori = {potensi?.kategori}</p>
        </div>
      )}

      {/* Main Content */}
       <div className="max-w-7xl mx-auto px-4 py-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-lg overflow-hidden mt-8">
              
              {/* Category Info and Stats */}
              <div className="p-4 mt-8 md:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">  
                {/* left side - Back button */}
                  <Link 
                    href="/potensi" 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                  </Link>
                  {/* right side - Category Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-green1-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green1-500 text-sm md:text-base">
                        {potensi.kategori || 'Kategori'}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative h-64 md:h-96 lg:h-[500px] w-full">
                <SimpleImage
                  src={potensi.foto}
                  alt={potensi.nama || "Potensi image"}
                  className="w-full h-full"
                  onError={() => {
                    console.error('Image failed to load:', potensi.foto);
                  }}
                />
              </div>

              {/* Article Body */}
              <div className="p-4 md:p-6">
                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                  {potensi.nama || "Nama Potensi"}
                </h1>

                {/* Stats Cards */}
               <div className="gap-4 mb-2">
                <div className="bg-blue-50 rounded-lg p-4">
                    <MapPin className="w-6 h-6 text-orange-500 mb-2" />
                    <p className="text-sm text-gray-600">Lokasi</p>
                    <p className="font-semibold text-blue-600 text-justify break-words">{potensi.lokasi || "Desa Sumbersawit"}</p>
                   {/* Maps Link */}
                    {potensi.maps_link && (
                    <div className="bg-white rounded-xl p-2 shadow-sm flex items-center justify-between mt-2">
                        <a
                        href={potensi.maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white-500 bg-orange-500 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg text-sm font-semibold shadow hover:shadow-md"
                        >
                        <MapPin className="w-5 h-5 text-white-500" />
                        Buka Maps
                        </a>
                    </div>
                    )}

                </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-base md:prose-lg max-w-none">
                  <div className="text-gray-700 leading-relaxed space-y-4 text-justify">
                    <p className="text-sm md:text-base">
                      {potensi.deskripsi || "Deskripsi potensi akan ditampilkan di sini."}
                    </p>

                    {/* Additional Info */}
                    {potensi.tahun_mulai && (
                      <div className="bg-gray-50 rounded-lg p-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Informasi Tambahan:</h4>
                        <p className="text-sm text-gray-600">
                          <strong>Tahun Mulai:</strong> {potensi.tahun_mulai}
                        </p>
                      </div>
                    )}

                    {/* Social Media Icons */}
                    {(potensi.shopee_link || potensi.facebook_link || potensi.instagram_link || potensi.whatsapp_link) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Hubungi Usaha UMKM Kami:</h4>
                        <div className="flex gap-3 flex-wrap">
                          {potensi.shopee_link && (
                            <a 
                              href={potensi.shopee_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg"
                              title="Shopee"
                            >
                              <ShoppingBag className="w-4 h-4 text-white" />
                            </a>
                          )}
                          {potensi.facebook_link && (
                            <a 
                              href={potensi.facebook_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-blue-500 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg"
                              title="Facebook"
                            >
                              <Facebook className="w-4 h-4 text-white" />
                            </a>
                          )}
                          {potensi.instagram_link && (
                            <a 
                              href={potensi.instagram_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg"
                              title="Instagram"
                            >
                              <Instagram className="w-4 h-4 text-white" />
                            </a>
                          )}
                          {potensi.whatsapp_link && (
                            <a 
                              href={potensi.whatsapp_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4 text-white" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Share Section */}
                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Bagikan Potensi:</h3>
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: potensi.nama,
                            url: window.location.href
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link telah disalin!');
                        }
                      }}
                      className="bg-green-500 text-white-500 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
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
                        Potensi {potensi.kategori} Lainnya
                      </h3>
                      <span className="text-sm text-gray-500">
                        {sameCategory.length} potensi
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
                                alt={item.nama || "Potensi image"}
                                className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                                onError={() => {
                                  console.error('Image failed to load:', item.foto);
                                }}
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <ItemIcon className="w-4 h-4 text-green1-500" />
                                <span className="text-xs text-green1-500">{item.kategori}</span>
                              </div>
                              <h4 className="font-bold text-gray-800 mb-2 text-sm md:text-base line-clamp-2 group-hover:text-green-600 transition-colors">
                                {item.nama || "Potensi Terkait"}
                              </h4>
                              <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">
                                {truncateText(item.deskripsi, 80)}
                              </p>
                              <div className="flex items-center justify-between">
                                <Link 
                                  href={`/detailpotensi?id=${item.id}`}
                                  className="bg-green1-500 hover:bg-green-600 text-white-500 text-xs px-6 py-2 rounded-full transition-colors font-medium"
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
                              : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-md hover:shadow-lg'
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
                                ? 'bg-green-500 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-md hover:shadow-lg'
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
                              : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-md hover:shadow-lg'
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

            {/* Related Potensi on Mobile */}
            <div className="lg:hidden mt-8">
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Potensi Lainnya</h3>
                <div className="space-y-4">
                  {relatedPotensi.length > 0 ? (
                    relatedPotensi.slice(0, 4).map((item, index) => {
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
                                alt={item.nama || "Potensi image"}
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
                              <ItemIcon className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-green-600">{item.kategori}</span>
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm md:text-base group-hover:text-green-600 transition-colors">
                              {item.nama || "Potensi Lainnya"}
                            </h4>
                            <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">
                              {truncateText(item.deskripsi, 80)}
                            </p>
                            <div className="flex items-center justify-between">
                              <Link 
                                href={`/detailpotensi?id=${item.id}`}
                                className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-full transition-colors font-medium"
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
                      Tidak ada potensi lain yang tersedia
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-8 space-y-6 mt-8">
              {/* Related Potensi */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Potensi Lainnya</h3>
                <div className="space-y-4">
                  {relatedPotensi.length > 0 ? (
                    relatedPotensi.slice(0, 5).map((item, index) => {
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
                                alt={item.nama || "Potensi image"}
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
                              <span className="text-xs text-green1-500">{item.kategori}</span>
                            </div>
                            <h4 className="font-medium text-gray-800 mb-1 text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
                              {item.nama || "Potensi Lainnya"}
                            </h4>
                            <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                              {truncateText(item.deskripsi, 50)}
                            </p>
                            <div className="flex items-center justify-between">
                              <Link 
                                href={`/detailpotensi?id=${item.id}`}
                                className="bg-green1-500 hover:bg-green-600 text-white-500 text-xs px-6 py-2 rounded-full transition-colors font-medium"
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
                      Tidak ada potensi lain yang tersedia
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