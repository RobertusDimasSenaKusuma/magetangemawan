"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';

export default function BeritaPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [berita, setBerita] = useState(null);
  const [relatedBerita, setRelatedBerita] = useState([]);
  const [sameCategory, setSameCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (id) {
      fetchBeritaDetail(id);
    } else {
      setError('ID berita tidak ditemukan');
      setLoading(false);
    }
  }, [id]);

  const fetchBeritaDetail = async (beritaId) => {
    try {
      setLoading(true);
      
      // Fetch semua data project dari API
      const response = await fetch('/api/project/get');
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data berita');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Gagal mengambil data berita');
      }
      
      // Cari berita berdasarkan ID
      const foundBerita = result.data.find(item => 
        item._id === beritaId || 
        item._id.$oid === beritaId ||
        item.id === beritaId
      );
      
      if (!foundBerita) {
        throw new Error('Berita tidak ditemukan');
      }
      
      setBerita(foundBerita);
      
      // Ambil berita terkait (6 berita lainnya DARI KATEGORI YANG BERBEDA untuk sidebar)
      const related = result.data
        .filter(item => 
          (item._id !== beritaId && item._id?.$oid !== beritaId && item.id !== beritaId) &&
          item.github !== foundBerita.github // Filter kategori yang berbeda
        )
        .slice(0, 6);
      
      setRelatedBerita(related);

      // Ambil semua berita dengan github yang sama (tanpa limit untuk pagination)
      const sameCategoryItems = result.data
        .filter(item => 
          (item._id !== beritaId && item._id?.$oid !== beritaId && item.id !== beritaId) &&
          item.github === foundBerita.github && foundBerita.github // pastikan github tidak null/undefined
        );
      
      setSameCategory(sameCategoryItems);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    let date;
    if (dateStr.$date?.$numberLong) {
      date = new Date(parseInt(dateStr.$date.$numberLong));
    } else {
      date = new Date(dateStr);
    }
    
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
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
          <Link 
            href="/#project" 
            className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Kembali ke Daftar Berita
          </Link>
        </div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Berita Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-4">Berita yang Anda cari tidak dapat ditemukan.</p>
          <Link 
            href="/#project" 
            className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Kembali ke Daftar Berita
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-lg overflow-hidden mt-8">
              
              {/* Author Info and Date - Improved Layout */}
              <div className="p-4 md:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">

                  {/* left side - Back button */}
                  <Link 
                    href="/#project" 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                  </Link>
                  
                  {/* Right side - Date and Category */}
                  <div className="text-right">
                    <p className="text-sm md:text-base text-gray-700 font-medium">
                      {formatDate(berita.createdAt) || "Tanggal publikasi"}
                    </p>
                    {berita.github && (
                      <span className="inline-block bg-orange-500 text-white-500 text-xs md:text-sm font-semibold px-2 py-1 md:px-3 md:py-1 rounded-full mt-1">
                        {berita.github}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {berita.image ? (
                <div className="relative h-64 md:h-96 lg:h-[500px] w-full">
                  <Image
                    src={berita.image}
                    alt={berita.name || "Berita image"}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              ) : (
                <div className="h-64 md:h-96 lg:h-[500px] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">Image</span>
                </div>
              )}

              {/* Article Body */}
              <div className="p-4 md:p-6">
                 {/* Left side - Author Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                        {berita.website || "Admin Penulis"}
                      </h3>
                    </div>
                  </div>
                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                  {berita.name || "Judul Berita"}
                </h1>

                {/* Article Content */}
                <div className="prose prose-base md:prose-lg max-w-none">
                  {berita.technologies ? (
                    <div className="text-gray-700 leading-relaxed space-y-4 text-justify">
                      {berita.technologies.split('\n').map((paragraph, index) => (
                        paragraph.trim() && (
                          <p key={index} className="text-sm md:text-base">
                            {paragraph}
                          </p>
                        )
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-700 leading-relaxed space-y-4">
                    </div>
                  )}
                </div>

                {/* Share Section */}
                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Bagikan Artikel:</h3>
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: berita.name,
                            url: window.location.href
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link telah disalin!');
                        }
                      }}
                      className="bg-green1-500 text-white-500 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 text-sm md:text-base"
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
                        Artikel Kategori terkait {berita.github}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {sameCategory.length} artikel
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      {currentItems.map((item, index) => (
                        <div 
                          key={item._id?.$oid || item._id || index}
                          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                        >
                          {item.image && (
                            <div className="relative h-40 md:h-48 w-full overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name || "Article image"}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 100vw, 50vw"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h4 className="font-bold text-gray-800 mb-2 text-sm md:text-base line-clamp-2 group-hover:text-green-600 transition-colors">
                              {item.name || "Artikel Terkait"}
                            </h4>
                            <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">
                              {truncateText(item.technologies, 80)}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-orange-500">
                                {formatDate(item.createdAt)}
                              </p>
                              <Link 
                                href={`/berita?id=${item._id?.$oid || item._id}`}
                                className="bg-green-500 hover:bg-green1-500 text-white-500 text-xs px-3 py-1 rounded-full transition-colors font-medium"
                              >
                                Baca Selengkapnya
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
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

            {/* Related Articles on Mobile */}
            <div className="lg:hidden mt-8">
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Berita Lainnya</h3>
                <div className="space-y-4">
                  {relatedBerita.length > 0 ? (
                    relatedBerita.slice(0, 4).map((item, index) => (
                      <div 
                        key={item._id?.$oid || item._id || index}
                        className="flex gap-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group p-4"
                      >
                        {/* Small Image */}
                        <div className="flex-shrink-0">
                          {item.image ? (
                            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name || "Article image"}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="80px"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm md:text-base group-hover:text-green-600 transition-colors">
                            {item.name || "Berita Lainnya"}
                          </h4>
                          <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">
                            {truncateText(item.description, 80)}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-orange-500">
                              {formatDate(item.createdAt)}
                            </p>
                            <Link 
                              href={`/berita?id=${item._id?.$oid || item._id}`}
                              className="bg-green1-500 hover:bg-green-600 text-white-500 text-xs px-3 py-1 rounded-full transition-colors font-medium"
                            >
                              Baca Selengkapnya
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    Array.from({length: 3}).map((_, index) => (
                      <div key={index} className="flex gap-4 bg-gray-50 rounded-lg shadow-md p-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Berita Lainnya</h4>
                          <p className="text-xs md:text-sm text-gray-600 mb-3">Lorem ipsum dolor sit amet...</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">Tanggal publikasi</p>
                            <span className="bg-gray-300 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">
                              Baca
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-8 space-y-6 mt-8">

              {/* Related Articles */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Berita Lainnya</h3>
                <div className="space-y-4">
                  {relatedBerita.length > 0 ? (
                    relatedBerita.slice(0, 5).map((item, index) => (
                      <div 
                        key={item._id?.$oid || item._id || index}
                        className="flex gap-3 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group p-3"
                      >
                        {/* Small Image */}
                        <div className="flex-shrink-0">
                          {item.image ? (
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name || "Article image"}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="56px"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 mb-1 text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
                            {item.name || "Berita Lainnya"}
                          </h4>
                          <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                            {truncateText(item.description, 50)}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-orange-500">
                              {formatDate(item.createdAt) || "Tanggal"}
                            </p>
                            <Link 
                              href={`/berita?id=${item._id?.$oid || item._id}`}
                              className="bg-green1-500 hover:bg-green-600 text-white-500 text-xs px-2 py-1 rounded-full transition-colors font-medium"
                            >
                              Baca Selengkapnya
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    Array.from({length: 5}).map((_, index) => (
                      <div key={index} className="flex gap-3 bg-gray-50 rounded-lg shadow-md p-3">
                        <div className="w-14 h-14 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 mb-1 text-sm">Berita Lainnya</h4>
                          <p className="text-xs text-gray-600 mb-2">Lorem ipsum dolor sit amet...</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">Tanggal publikasi</p>
                            <span className="bg-gray-300 text-gray-500 text-xs px-2 py-1 rounded-full font-medium">
                              Baca
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
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