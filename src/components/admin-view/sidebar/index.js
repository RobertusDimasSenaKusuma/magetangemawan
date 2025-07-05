"use client";

import { useState } from "react";

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
      icon: "📁",
      color: "indigo",
      description: "kelola berita & artikel",
    },
    {
      id: "contact",
      label: "Saran & Masukan",
      icon: "📧",
      color: "indigo",
      description: "kelola saran",
    },
  ];

  const handleTabChange = (tabId) => {
    setCurrentSelectedTab(tabId);
    resetFormDatas();
    setUpdate(false);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    setAuthUser(false);
    sessionStorage.removeItem("authUser");
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
            <div>
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              <p className="text-sm text-gray-400">Dashboard v3.0</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="py-6 px-4">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-gray-400 uppercase px-3 mb-4 tracking-wider">
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
                <div className="relative">
                  <span className={`
                    text-xl transition-all duration-200
                    ${currentSelectedTab === item.id ? 'scale-110' : 'group-hover:scale-110'}
                  `}>
                    {item.icon}
                  </span>
                  {currentSelectedTab === item.id && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className={`
                    text-base font-semibold transition-colors duration-200
                    ${currentSelectedTab === item.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                  `}>
                    {item.label}
                  </div>
                  <div className={`
                    text-sm transition-colors duration-200
                    ${currentSelectedTab === item.id ? 'text-green-200' : 'text-gray-400 group-hover:text-gray-300'}
                  `}>
                    {item.description}
                  </div>
                </div>
                
                {/* Right indicator */}
                <div className="flex items-center space-x-2">
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

        {/* Quick Stats or Additional Info */}
        <div className="px-4 py-3">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center space-x-2">
              <span className="text-lg">📊</span>
              <div>
                <p className="text-sm font-medium text-white">System Status</p>
                <p className="text-xs text-green-400">All systems operational</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-white-500">
          <div className="bg-gray-700/50 rounded-lg p-4 mb-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-lg">👨‍💻</span>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-white truncate">Admin User</p>
                <p className="text-sm text-gray-400 truncate">admin@example.com</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-left text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">🚪</span>
            <div className="flex-1">
              <span className="text-base font-semibold">Logout</span>
              <div className="text-sm text-gray-400 group-hover:text-gray-300">Sign out</div>
            </div>
            <svg 
              className="w-4 h-4 text-red-500 group-hover:text-red-400 transition-colors duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}