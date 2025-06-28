"use client";

import { useState, useEffect } from "react";
import FormControls from "../form-controls";
import Image from "next/image";

const controls = [
  {
    name: "name",
    placeholder: "Project Name",
    type: "text",
    label: "Project Name",
  },
  {
    name: "technologies",
    placeholder: "Enter Technologies (separated by comma)",
    type: "text",
    label: "Technologies",
  },
  {
    name: "website",
    placeholder: "Website URL",
    type: "url",
    label: "Website",
  },
  {
    name: "github",
    placeholder: "Github URL",
    type: "url",
    label: "Github",
  },
];

export default function AdminProjectView({ 
  formData, 
  setFormData, 
  handleSaveData, 
  data 
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can make this configurable

  // Calculate pagination
  const totalItems = data ? data.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data ? data.slice(startIndex, endIndex) : [];

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }

      setError('');
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProject = async (e) => {
    if (e) e.preventDefault();
    
    setIsLoading(true);
    setError('');
    
    try {
      // Validasi form
      if (!formData.name || !formData.technologies) {
        setError('Project name and technologies are required');
        setIsLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('technologies', formData.technologies.trim());
      formDataToSend.append('website', formData.website?.trim() || '');
      formDataToSend.append('github', formData.github?.trim() || '');
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await fetch('/api/project/add', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Reset form
        setFormData({
          name: '',
          technologies: '',
          website: '',
          github: ''
        });
        setSelectedImage(null);
        setImagePreview(null);
        setIsModalOpen(false);
        setError('');
        
        // Show success message
        alert('Project added successfully!');
        
        // Auto reload page after successful add
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setError(result.message || 'Failed to add project');
      }
    } catch (error) {
      console.error('Error adding project:', error);
      setError(error.message || 'An error occurred while adding the project');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const openModal = () => {
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setSelectedImage(null);
    setImagePreview(null);
    // Reset form when closing modal
    setFormData({
      name: '',
      technologies: '',
      website: '',
      github: ''
    });
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
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
        <div className="flex items-center text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} projects
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'bg-green1-500 text-white-500 cursor-not-allowed'
                : 'bg-green1-500 text-white-500 hover:bg-green1-500 border border-green1-500'
            }`}
          >
            Previous
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-green1-500 text-white-500 hover:bg-gray-100 border border-gray-300"
              >
                1
              </button>
              {startPage > 2 && <span className="text-gray-500">...</span>}
            </>
          )}
          
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Existing Projects Table */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Berita & Artikel</h2>
            <button
              onClick={openModal}
              className="px-6 py-3 bg-green1-500 text-white-500 rounded-lg hover:bg-green1-500 transition-all duration-200 shadow-lg font-semibold"
            >
              Add New Project
            </button>
          </div>
          
          {data && data.length ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Technologies</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Website</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Github</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.image ? (
                            <div className="relative w-16 h-16">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover rounded-lg shadow-sm"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-white">{item.technologies}</td>
                        <td className="px-6 py-4 text-sm text-white">
                          {item.website ? (
                            <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                              Visit
                            </a>
                          ) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.github ? (
                            <a href={item.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                              View
                            </a>
                          ) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {new Date(item.createdAt).toLocaleDateString()}
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
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📁</div>
              <p className="text-gray-500 text-lg">No projects found</p>
              <p className="text-gray-400 text-sm">Click "Add New Project" to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal with SOLID BACKGROUND */}
      {isModalOpen && (
        <>
          {/* Modal Backdrop - SOLID BLACK */}
          <div className="fixed inset-0 bg-black z-40"></div>
          
          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
              {/* Modal Header - SOLID BLUE */}
              <div className="bg-orange-500 p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white">Add New Project</h2>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 text-3xl font-light transition-colors p-2 hover:bg-blue-700 rounded-full"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Body - SOLID WHITE */}
              <div className="bg-white-500 p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                <form onSubmit={handleSubmitProject} className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
                      <div className="flex">
                        <div className="text-red-500 font-semibold">⚠️ Error:</div>
                        <div className="ml-2 text-red-700">{error}</div>
                      </div>
                    </div>
                  )}

                  {/* Form Controls in Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <FormControls
                        controls={controls}
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                  </div>

                  {/* Image Upload Section - SOLID BACKGROUND */}
                  <div className="border-2 border-gray-300 rounded-xl p-6 bg-gray-100">
                    <label className="block text-gray-700 text-lg font-semibold mb-4">
                      Project Image
                    </label>
                    
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white"
                      />
                      <p className="text-sm text-gray-600">
                        Supported formats: JPEG, PNG, WebP. Maximum size: 5MB
                      </p>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-6">
                        <label className="block text-gray-700 text-lg font-semibold mb-3">
                          Image Preview
                        </label>
                        <div className="relative w-full max-w-md mx-auto">
                          <div className="relative w-full h-48 border-2 border-gray-300 rounded-xl overflow-hidden shadow-lg bg-white">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-600 transition-colors shadow-lg"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Actions - SOLID BACKGROUND */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold shadow-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-8 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg ${
                        isLoading 
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                          : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-xl'
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding Project...
                        </span>
                      ) : 'Add Project'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}