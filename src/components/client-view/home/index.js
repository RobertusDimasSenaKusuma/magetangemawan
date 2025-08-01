"use client";

import { useMemo, useRef, useState } from "react";
import AnimationWrapper from "../animation-wrapper";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaLeaf,
  FaPlay,
  FaTimes,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import Image from "next/image";
import desaImage from "../../../assets/desa.jpg"; // Background image
import landscapeImage from "../../../assets/foto2.jpg"; // Gambar pemandangan desa
import farmerImage from "../../../assets/foto1.jpg"; // Gambar petani

function variants() {
  return {
    offscreen: {
      y: 150,
      opacity: 0,
    },
    onscreen: ({ duration = 2 } = {}) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration,
      },
    }),
  };
}

const features = [
  {
    icon: <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-500" />,
    title: "Lokasi",
    desc: "Terletak di kecamatan Sidorejo kabupaten Magetan"
  },
  {
    icon: <FaUsers className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-500" />,
    title: "Masyarakat Ramah",
    desc: "Warga yang gotong royong"
  },
  {
    icon: <FaLeaf className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green1-500" />,
    title: "Lingkungan Asri",
    desc: "Udara bersih dan sejuk"
  },
];

export default function ClientHomeView({ data }) {
  console.log(data, "ClientHomeView");

  const setVariants = useMemo(() => variants(), []);
  const containerRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);

  // Function to scroll down smoothly
  const handleJelajahiDesa = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  // Function to show YouTube video modal
  const handlePlayProfilDesa = () => {
    setShowVideo(true);
  };

  // Function to close video modal
  const closeVideo = () => {
    setShowVideo(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Image with Low Opacity */}
      <div className="absolute inset-0 z-0">
        <Image
          src={desaImage}
          alt="Background Desa"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      {/* Background Decorations - Enhanced iPad Pro support */}
      <div className="absolute top-0 left-2 sm:left-10 md:left-8 lg:left-10 xl:left-16 w-32 h-32 sm:w-48 sm:h-48 md:w-40 md:h-40 lg:w-56 lg:h-56 xl:w-72 xl:h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-0 right-2 sm:right-10 md:right-8 lg:right-10 xl:right-16 w-32 h-32 sm:w-48 sm:h-48 md:w-40 md:h-40 lg:w-56 lg:h-56 xl:w-72 xl:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-10 left-1/2 w-32 h-32 sm:w-48 sm:h-48 md:w-40 md:h-40 lg:w-56 lg:h-56 xl:w-72 xl:h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      
      {/* Container with enhanced iPad Pro responsive padding */}
      <div className="max-w-screen-xl pt-16 sm:pt-20 md:pt-20 lg:pt-24 xl:pt-28 pb-20 sm:pb-24 md:pb-16 lg:pb-20 xl:pb-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto relative z-10" id="home">
        <AnimationWrapper>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-8 lg:gap-10 xl:gap-12 py-4 sm:py-6 md:py-4 lg:py-1"
            variants={setVariants}
          >
            {/* Content Section */}
            <div className="flex flex-col justify-center items-start order-2 lg:order-1 space-y-4 sm:space-y-5 md:space-y-5 lg:space-y-6 xl:space-y-8">
              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full"
              >
                {/* Badge - Enhanced iPad Pro responsiveness */}
                <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 md:px-3.5 md:py-1.5 lg:px-4 lg:py-2 bg-green-100 rounded-full mb-2 sm:mb-4 md:mb-3 lg:mb-4">
                  <FaLeaf className="w-3 h-3 sm:w-4 sm:h-4 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-green-600 mr-1.5 sm:mr-2 md:mr-1.5 lg:mr-2" />
                  <span className="text-green-700 font-medium text-xs sm:text-sm md:text-xs lg:text-sm leading-tight">
                    Program Kuliah Kerja Nyata (KKN) Universitas Gadjah Mada
                  </span>
                </div>
                
                {/* Main Title - Enhanced iPad Pro typography */}
                <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight mb-3 sm:mb-4 md:mb-3 lg:mb-4">
                  <span className="text-gray-800">Jelajahi Potensi</span>
                  <br />
                  <span className="text-green1-main">desa Sumbersawit</span>
                  <br />
                </h1>
        
                {/* Description - Enhanced iPad Pro text sizing */}
                <p className="text-gray-600 text-sm sm:text-base md:text-base lg:text-lg max-w-full lg:max-w-2xl leading-relaxed">
                  Desa yang kaya akan potensi alam dan budaya, menawarkan keindahan persawahan hijau, 
                  tradisi lokal yang masih terjaga, dan peluang wisata agro yang menjanjikan untuk 
                  pengembangan ekonomi masyarakat.
                </p>
              </motion.div>

              {/* Features - Enhanced iPad Pro grid layout */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-3 lg:gap-4 w-full"
              >
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-3 lg:p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-2 lg:space-x-3">
                      <div className="p-1.5 sm:p-2 md:p-1.5 lg:p-2 bg-green-100 rounded-lg flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base md:text-sm lg:text-base">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm md:text-xs lg:text-sm leading-tight">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons - Enhanced iPad Pro layout */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-3 lg:gap-4 w-full"
              >
                <button 
                  onClick={handleJelajahiDesa}
                  className="px-6 py-3 sm:px-8 sm:py-4 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-green1-500 text-white-500 font-semibold rounded-xl border-2 border-green1-500 hover:bg-green-50 hover:border-green-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base md:text-sm lg:text-base cursor-pointer"
                >
                  Jelajahi Desa
                </button>
                <button 
                  onClick={handlePlayProfilDesa}
                  className="px-6 py-3 sm:px-8 sm:py-4 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-orange-500 text-white-500 font-semibold rounded-xl border-2 border-transparent hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 md:gap-2 lg:gap-3 text-sm sm:text-base md:text-sm lg:text-base cursor-pointer"
                >
                  <FaPlay className="w-3 h-3 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-4 lg:h-4" />
                  Play Profil Desa
                </button>
              </motion.div>

              {/* Social Media Icons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex items-center gap-4 w-full"
              >
                <span className="text-gray-600 text-sm sm:text-base font-medium">
                  Sosial Media Desa Kami
                </span>
                <a
                  href="https://www.tiktok.com/@desa.sumbersawit?_t=ZS-8yTh18Pi1PG&_r=1"
                  className="flex items-center justify-center w-12 h-12 bg-white-500 text-white rounded-full hover:bg-gray-800 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaTiktok className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com/@desasumbersawitmagetan?si=VOBFseiCY292nDM7"
                  className="flex items-center justify-center w-12 h-12 bg-white-500 text-orange-500 rounded-full hover:bg-red-700 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaYoutube className="w-5 h-5" />
                </a>
              </motion.div>
            </div>

            {/* Image Section - Enhanced iPad Pro layout */}
            <motion.div 
              ref={containerRef} 
              className="flex w-full justify-center lg:justify-end items-center order-1 lg:order-2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative group w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-none"
              >
                {/* Container for both images - Enhanced iPad Pro sizing */}
                <div className="relative w-full h-[350px] sm:h-[400px] md:h-[380px] lg:h-[450px] xl:h-[500px] 2xl:h-[550px] max-w-[300px] sm:max-w-[350px] md:max-w-[320px] lg:max-w-[380px] xl:max-w-[420px] 2xl:max-w-[450px] mx-auto">
                  
                  {/* First Image - Background/Landscape */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="absolute top-6 sm:top-8 md:top-6 lg:top-8 xl:top-10 left-0 w-[180px] sm:w-[200px] md:w-[190px] lg:w-[220px] xl:w-[240px] 2xl:w-[280px] h-[250px] sm:h-[280px] md:h-[260px] lg:h-[300px] xl:h-[350px] 2xl:h-[400px] rounded-2xl overflow-hidden shadow-xl transform rotate-3 hover:rotate-1 transition-transform duration-500"
                  >
                    <div className="w-full h-full relative">
                      <Image
                        src={landscapeImage}
                        alt="Pemandangan Desa"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, (max-width: 1024px) 190px, (max-width: 1280px) 220px, (max-width: 1536px) 240px, 280px"
                      />
                    </div>
                  </motion.div>

                  {/* Second Image - Portrait/Person */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="absolute bottom-0 right-0 w-[160px] sm:w-[180px] md:w-[170px] lg:w-[190px] xl:w-[210px] 2xl:w-[250px] h-[250px] sm:h-[280px] md:h-[260px] lg:h-[300px] xl:h-[350px] 2xl:h-[400px] rounded-2xl overflow-hidden shadow-2xl transform -rotate-6 hover:-rotate-3 transition-transform duration-500"
                  >
                    <div className="w-full h-full relative">
                      <Image
                        src={farmerImage}
                        alt="Petani Lokal"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, (max-width: 1024px) 170px, (max-width: 1280px) 190px, (max-width: 1536px) 210px, 250px"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Floating Elements - Enhanced iPad Pro sizing */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 sm:-top-6 md:-top-4 lg:-top-6 xl:-top-8 2xl:-top-9 -right-3 sm:-right-4 md:-right-3 lg:-right-4 xl:-right-5 2xl:-right-6 w-12 h-12 sm:w-16 sm:h-16 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 2xl:w-20 2xl:h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg z-30"
                  >
                    <span className="text-lg sm:text-xl md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl">🌾</span>
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-2 sm:-bottom-3 md:-bottom-2 lg:-bottom-3 xl:-bottom-3 2xl:-bottom-4 -left-2 sm:-left-3 md:-left-2 lg:-left-3 xl:-left-3 2xl:-left-4 w-10 h-10 sm:w-12 sm:h-12 md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg z-10"
                  >
                    <span className="text-sm sm:text-base md:text-sm lg:text-base xl:text-lg 2xl:text-xl">🏘️</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimationWrapper>
      </div>
      
      {/* Wave - Reduced vertical height */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg 
          className="relative block w-full h-8 sm:h-10 md:h-8 lg:h-12 xl:h-16" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95"/>
              <stop offset="50%" stopColor="#f8fafc" stopOpacity="1"/>
              <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.95"/>
            </linearGradient>
          </defs>
          <path 
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,80C960,96,1056,128,1152,128C1200,128,1248,96,1296,80L1344,64L1344,192L1296,192C1248,192,1152,192,1056,192C960,192,864,192,768,192C672,192,576,192,480,192C384,192,288,192,192,192C96,192,48,192,24,192L0,192Z" 
            fill="url(#waveGradient)"
          />
        </svg>
      </div>
{showVideo && (
  <div className="fixed inset-0 bg-black bg-opacity-75 z-50 p-4 flex items-center justify-center min-h-screen">
    <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden">
      {/* Close button */}
      <button
        onClick={closeVideo}
        className="absolute top-2 right-4 z-10 bg-red text-white p-3 rounded-full hover:bg-red-700 transition-colors duration-200 shadow-lg font-bold"
      >
        <FaTimes className="w-6 h-6 font-bold" />
      </button>

      {/* Video container */}
      <div className="relative pb-[56.25%] h-0">F
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/T8qE5AcE1yY?autoplay=1"
          title="Profil Desa"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  </div>
 )}
    </div>
  );
}