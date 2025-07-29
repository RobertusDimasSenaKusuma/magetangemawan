"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowRight } from "react-icons/fa";
import { motion } from 'framer-motion';
import { ArrowRight,Building2, Palmtree, ShoppingBag, Tractor, Beef } from 'lucide-react';

// Animation Wrapper Component
const AnimationWrapper = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
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
    default:
      return Building2;
  }
};

export default function ServicesSection() {
  const [potensiData, setPotensiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/potensi/get/');
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }

      const result = await response.json();
      const data = result.data; // Ambil data dari key "data"

      // Ambil item per kategori (hanya satu item per kategori)
      const categories = {};
      const representativeData = [];

      if (Array.isArray(data)) {
        data.forEach(item => {
          if (!categories[item.kategori]) {
            categories[item.kategori] = true;
            representativeData.push(item);
          }
        });
      }

      // Batasi hanya 4 item
      setPotensiData(representativeData.slice(0, 4));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchData();
}, []);


  // Handle "View All Services" button click
  const handleViewAllServices = () => {
    window.location.href = '/potensi';
  };

  

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm sm:text-base font-medium">Loading services...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white border border-red-100 rounded-xl p-6 shadow-md max-w-sm w-full">
          <p className="text-red-600 text-sm sm:text-base font-semibold">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section id="experience" className="min-h-screen bg-gray-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <AnimationWrapper className="text-center mb-12 sm:mb-16">
          <motion.p 
            className="text-orange-500 text-sm font-medium uppercase tracking-wide mb-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
          </motion.p>
          
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gray-900">Jelajahi Potensi</span>
            <br />
            <span className="text-green1-500">Desa Kami</span>
          </motion.h1>
        </AnimationWrapper>

        {/* Services Cards */}
        <AnimationWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {potensiData.map((item, index) => {
              const IconComponent = getCategoryIcon(item.kategori);
              
              return (
                <motion.div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 mx-2 sm:mx-0"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Image Section */}
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={item.foto}
                      alt={item.nama}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 sm:p-8">
                    {/* Icon */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white-500 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto -mt-12 sm:-mt-14 relative z-10 shadow-lg">
                      <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-green1-500" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                      {item.kategori}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 text-center">
                      {item.deskripsi.length > 100 
                        ? `${item.deskripsi.substring(0, 100)}...` 
                        : item.deskripsi}
                    </p>

                    {/* Baca Selengkapnya Button */}
                <div className="pt-3 border-t border-gray-100 text-center">
                   <Link
                     href={`/detailpotensi?id=${item.id || item._id}`}
                    className="bg-orange-500 hover:bg-orange-500 text-white-500 text-xs px-6 py-2 rounded-full transition-colors font-medium"
                  >
                    Baca Selengkapnya <span>→</span>
                  </Link>
                </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimationWrapper>

        {/* View All Services Button */}
        <AnimationWrapper className="text-center px-4 sm:px-0">
          <div className="flex items-center justify-center gap-4">
            <motion.button
              onClick={handleViewAllServices}
              className="bg-green1-500 hover:bg-orange-600 text-white-300 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto max-w-sm sm:max-w-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm sm:text-base text-center">Lihat Potensi Selengkapnya</span>
              <FaArrowRight className="text-white-500 w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </AnimationWrapper>
        {/* Empty State */}
        {potensiData.length === 0 && !loading && (
          <div className="text-center py-12 px-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
              <p className="text-gray-500 text-base sm:text-lg font-medium">
                No services data available yet
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}