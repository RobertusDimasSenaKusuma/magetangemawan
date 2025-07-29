"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import logoImage from "../../../assets/logo2.jpg"; 

export default function AdminSidebar({
  currentSelectedTab,
  setCurrentSelectedTab,
  resetFormDatas,
  setUpdate,
  setAuthUser,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const menuItems = [
    {
      id: "project",
      label: "Berita & Artikel",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: "indigo",
    },
    {
      id: "potensi",
      label: "Kelola Potensi",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "indigo",
    },
    {
      id: "prasarana",
      label: "Kelola Prasarana",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "indigo",
    },
    {
      id: "lembaga",
      label: "Kelola Lembaga",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "indigo",
    },
    {
      id: "kegiatan",
      label: "Kelola Kegiatan",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "indigo",
    },
    {
      id: "contact",
      label: "Saran & Masukan",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "indigo",
    },
  ];

  // Load active tab from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('activeTab');
      if (savedTab && menuItems.find(item => item.id === savedTab)) {
        setCurrentSelectedTab(savedTab);
      }
    }
  }, [setCurrentSelectedTab]);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && currentSelectedTab) {
      localStorage.setItem('activeTab', currentSelectedTab);
    }
  }, [currentSelectedTab]);

  const handleTabChange = (tabId) => {
    setCurrentSelectedTab(tabId);
    resetFormDatas();
    setUpdate(false);
    
    // Save the selected tab to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTab', tabId);
    }
    
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    setAuthUser(false);
    sessionStorage.removeItem("authUser");
    // Clear active tab on logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('activeTab');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Sidebar Toggle Button - Desktop & Mobile */}
      <button
        onClick={toggleSidebar}
        className={`
          fixed top-4 z-[60] p-2 rounded-md bg-green1-500 text-white-500 m-2
          hover:bg-green1-500 transition-all duration-300 shadow-lg
          ${isSidebarOpen ? 'left-[280px] md:left-[300px]' : 'left-4'}
        `}
      >
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-800/80 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-full bg-white-500 text-white z-50 transition-all duration-300 shadow-2xl
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          w-72 md:w-70
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image 
                src={logoImage}
                alt="Logo Desa Sumbersawit" 
                width={40}
                height={40}
                className="rounded-lg object-contain"
              />
            </div>
            {/* Text Content */}
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Admin Panel</h2>
              <p className="text-xs text-gray-400 leading-tight mt-2">Desa Sumbersawit</p>
              <p className="text-xs text-gray-400 leading-tight mt-1">KKN-PPM UGM 2025 </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="py-6 px-4">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-gray-400 uppercase px-3 mb-4 tracking-wider leading-tight">
              Navigation
            </div>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`
                  w-full flex items-center space-x-3 p-4 rounded-lg text-left relative
                  transition-all duration-200 hover:bg-green1-500 hover:shadow-md group
                  ${currentSelectedTab === item.id 
                    ? "bg-green1-500 text-white-500 shadow-lg border-l-4 border-white-500" 
                    : "text-gray-300 hover:text-white-500 border-l-4 border-transparent"
                  }
                `}
              >
                {/* Left border indicator */}
                <div 
                  className={`
                    absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-200
                    ${currentSelectedTab === item.id ? 'bg-green-300' : 'bg-transparent group-hover:bg-green-400'}
                  `}
                />
                
                {/* Icon with active indicator */}
                <div className="relative flex-shrink-0">
                  <div className={`
                    transition-all duration-200
                    ${currentSelectedTab === item.id ? 'scale-110' : 'group-hover:scale-110'}
                  `}>
                    {item.icon}
                  </div>
                  {currentSelectedTab === item.id && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`
                    text-sm font-semibold transition-colors duration-200 leading-tight truncate
                    ${currentSelectedTab === item.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                  `}>
                    {item.label}
                  </div>
                </div>
                
                {/* Right indicator */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {currentSelectedTab === item.id && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                      <svg 
                        className="w-4 h-4 text-green-300" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </div>
                  )}
                  {currentSelectedTab !== item.id && (
                    <svg 
                      className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition-colors duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-white-500">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-left text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 group"
          >
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold leading-tight">Logout</span>
              <div className="text-xs text-gray-400 group-hover:text-gray-300 leading-tight">Sign out</div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}