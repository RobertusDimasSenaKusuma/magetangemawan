"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Book } from "lucide-react";
import Image from "next/image";
import desaImage from "../../../assets/image 2.png";
import Link from 'next/link';


// Mock AnimationWrapper component
function AnimationWrapper({ children, className }) {
  return (
    <motion.div
      className={className}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.8 }}
    >
      {children}
    </motion.div>
  );
}

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

const skillItemVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function ClientAboutView({ data = {} }) {
  console.log(data, "aboutdata");

  const setVariants = useMemo(() => variants(), []);

  // Statistics data matching the image design
  const statisticsData = [
    { 
      number: "3000+", 
      label: "Warga Desa", 
      icon: "👥",
      
     
    },
    { 
      number: "25", 
      label: "Program KKN", 
      icon: "📚",
     
    },
    { 
      number: "15", 
      label: "UMKM Aktif", 
      icon: "🏪",
     
    },
    { 
      number: "98%", 
      label: "Kepuasan", 
      icon: "⭐",
      
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 py-24 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 rounded-full blur-xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-16 relative z-10" id="about">
        
        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 "
        >
          {statisticsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className={`${stat.bgColor} rounded-2xl p-6 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden flex flex-col items-center justify-center text-center`}
            >
              <div className={`${stat.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <div className={`text-2xl lg:text-3xl font-bold ${stat.textColor} mb-1`}>
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Section - Changed order for responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2  items-start">
          
          {/* Right Content - Map Section (Now first on mobile) */}
          <AnimationWrapper className="relative lg:order-2">
            <motion.div variants={setVariants} className="relative">
              {/* Map Container */}
              <div className="bg-gradient-to-br from-slate-80/80 to-blue-80/80 backdrop-blur-md rounded-2xl  relative overflow-hidden shadow-x5">
                {/* Map Image with Animation */}
                <motion.div 
                  className="relative mt-12 w-full h-80 rounded-xl overflow-hidden pt-6"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src={desaImage}
                      alt="Peta Desa Sumbersawit"
                      width={600}
                      height={500}
                      className="object-cover block mx-auto rounded-xl"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                  
                  {/* Overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl"></div>
                  
                </motion.div>
                
                {/* Title Badge */}
                <motion.div 
                  className="absolute top-4 right-4 bg-gradient-to-r from-orange-100/90 to-orange-50/90 backdrop-blur-sm text-orange-700 px-4 py-2 rounded-full text-sm font-semibold shadow-md"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Kecamatan Sidorejo
                </motion.div>
              </div>
            </motion.div>
          </AnimationWrapper>

          {/* Left Content - Text Description (Now second on mobile) */}
          <AnimationWrapper className="space-y-6 lg:order-1">
            <motion.div variants={setVariants} className="space-y-6">
              <div className="space-y-4">
                <p className="text-gray-800 leading-relaxed text-justify">
                  Selama dua tahun menjadi Staff Jaringan Eksternal BEM KM SV UGM, saya menimba kerja sama strategis dengan berbagai instansi eksternal melalui koordinasi, negosiasi, dan komunikasi yang efektif. Pengalaman ini menjadi sarana penguatan kemampuan interpersonal sekaligus pengamalan nilai-nilai Pancasila, khususnya sila keempat dan kelima, melalui semangat musyawarah, gotong royong, dan keadilan dalam membangun kolaborasi.
                </p>
                
                <p className="text-gray-800 leading-relaxed text-justify">
                  Selama dua tahun menjadi Staff Jaringan Eksternal BEM KM SV UGM, saya menjalani kerja sama strategis dengan berbagai instansi eksternal melalui koordinasi, negosiasi, dan komunikasi yang efektif. Pengalaman ini menjadi sarana penguatan kemampuan interpersonal sekaligus pengamalan nilai-nilai Pancasila.
                </p>
              </div>
              <br>
              </br>
              
              <Link href="/sejarah" className="pt-4">
                <motion.button
                  className="bg-gradient-to-r from-green-main to-green-500 text-white-500 font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl active:scale-95 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Book size={20} className="text-white-500" />
                  Baca Profil Desa
                </motion.button>
              </Link>            
            
            </motion.div>
          </AnimationWrapper>
        </div>
      </div>
    </div>
  );
}