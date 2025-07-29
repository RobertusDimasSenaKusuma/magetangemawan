"use client";

import { useState } from "react";

export default function AdminContactView({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Calculate pagination
  const totalItems = data ? data.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data ? data.slice(startIndex, endIndex) : [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <span className="bg-white px-3 py-1 rounded-lg shadow-sm border">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} contacts
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border shadow-sm hover:shadow-md'
            }`}
          >
            Previous
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border shadow-sm hover:shadow-md transition-all"
              >
                1
              </button>
              {startPage > 2 && <span className="text-gray-400 px-1">...</span>}
            </>
          )}
          
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === number
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border shadow-sm hover:shadow-md'
              }`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-400 px-1">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border shadow-sm hover:shadow-md transition-all"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border shadow-sm hover:shadow-md'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="bg-green1-500 backdrop-blur-sm rounded-xl shadow-lg border border-white-500 p-2 mt-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-1xl font-bold text-white-500 mb-1">Contact Messages</h1>
              </div>
              <div className="flex items-center bg-white-500 px-4 py-2 rounded-lg border border-white-500">
                <svg className="w-5 h-5 text-green1-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-green1-500 font-semibold">{totalItems} Messages</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Table */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-white/20 max-h-156">
          {data && data.length ? (
            <>
              <div className="overflow-x-auto max-h-150">
                <table className="min-w-full table-fixed">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-800 to-slate-700 text-white">
                      <th className="w-1/6 px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                        <div className="flex items-center justify-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Name
                        </div>
                      </th>
                      <th className="w-1/5 px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                        <div className="flex items-center justify-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                          Email
                        </div>
                      </th>
                      <th className="w-3/4 px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Message
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentData.map((item, index) => (
                      <tr 
                        key={index} 
                        className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                      >
                        <td className="w-1/6 px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                                {item.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="w-1/5 px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="bg-gray-100 group-hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors">
                              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-800">
                                {item.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="w-3/4 px-6 py-4">
                          <div className="max-w-full">
                            <div className="text-sm text-gray-700 leading-relaxed">
                              <div className="bg-gray-50 group-hover:bg-blue-50 p-3 rounded-lg border border-gray-200 group-hover:border-blue-200 transition-all">
                                <div className="line-clamp-3 whitespace-pre-line">
                                  {item.message}
                                </div>
                                {item.message.length > 150 && (
                                  <button className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1 hover:underline">
                                    Read more...
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <Pagination />
            </>
          ) : (
            <div className="text-center py-16">
                <div className="relative mb-6">
                  <div className="text-6xl opacity-20">📧</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-12 h-12 rounded-full animate-pulse opacity-50"></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Contact Messages</h3>
                <p className="text-gray-500 mb-6">No messages have been received yet. Messages will appear here when visitors contact you.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-center text-blue-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Messages from your portfolio contact form will appear here</span>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}