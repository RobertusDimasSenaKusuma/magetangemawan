"use client";

import { useState, useEffect } from "react";
import FormControls from "../form-controls";
import Image from "next/image";

const controls = [
  {
    name: "name",
    placeholder: "Masukkan judul artikel atau berita",
    type: "text",
    label: "Judul Artikel atau Berita",
  },
  {
    name: "technologies",
    placeholder: "Masukkan deskripsi atau isi berita",
    type: "textarea",
    label: "Deskripsi atau Isi Berita",
  },
  {
    name: "website",
    placeholder: "Masukkan nama penulis",
    type: "text",
    label: "Penulis",
  },
];

const categoryOptions = [
  { value: "", label: "Pilih Kategori" },
  { value: "wisata", label: "Wisata" },
  { value: "situs", label: "Situs" },
  { value: "umum", label: "Umum" },
  { value: "masyarakat", label: "Masyarakat" },
  { value: "budaya", label: "Budaya" },
  { value: "sejarah", label: "Sejarah" },
  { value: "ekonomi", label: "Ekonomi" },
  { value: "pendidikan", label: "Pendidikan" },
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
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Alert states
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, message: '', onConfirm: null });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

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

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to show alert
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  // Function to show confirm dialog
  const showConfirmDialog = (message, onConfirm) => {
    setConfirmDialog({ show: true, message, onConfirm });
  };

  // Function to truncate text
  const truncateText = (text, maxLength = 80) => {
    if (!text) return 'N/A';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG,jpg)');
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
    if (!formData.name || !formData.technologies || !formData.github) {
      setError('Judul, deskripsi, dan kategori wajib diisi');
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();

    // Tambahkan ID jika sedang dalam mode edit
    if (isEditing && editingItem?._id) {
      formDataToSend.append("id", editingItem._id); // ✅ FIX
    }

    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('technologies', formData.technologies.trim());
    formDataToSend.append('website', formData.website?.trim() || '');
    formDataToSend.append('github', formData.github?.trim() || '');
    formDataToSend.append('youtube', formData.youtube?.trim() || ''); // Add YouTube field

    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }

    const url = isEditing ? `/api/project/update` : '/api/project/add';
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      body: formDataToSend,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}\n${errorText}`);
    }

    const result = await response.json();

    if (result.success) {
      // Reset form dan tutup modal
      setFormData({ name: '', technologies: '', website: '', github: '', youtube: '' }); // Add YouTube to reset
      setSelectedImage(null);
      setImagePreview(null);
      setIsModalOpen(false);
      setError('');
      setIsEditing(false);
      setEditingItem(null);
      showAlert('success', isEditing ? 'Artikel berhasil diupdate!' : 'Artikel berhasil ditambahkan!');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setError(result.message || `Gagal ${isEditing ? 'mengupdate' : 'menambahkan'} artikel`);
    }

  } catch (error) {
    console.error(`Error saat ${isEditing ? 'update' : 'tambah'}:`, error);
    setError(error.message || `Terjadi kesalahan saat ${isEditing ? 'update' : 'tambah'} artikel`);
  } finally {
    setIsLoading(false);
  }
};

  const handleEdit = (item) => {
    console.log('Editing item:', item);
    setEditingItem(item);
    setIsEditing(true);
    setFormData({
      name: item.name || '',
      technologies: item.technologies || '',
      website: item.website || '',
      github: item.github || '',
      youtube: item.youtube || '' // Add YouTube field to edit
    });
    if (item.image) {
      setImagePreview(item.image);
    }
    setSelectedImage(null); // Reset selected image ketika edit
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (itemId) => {
    showConfirmDialog(
      'Apakah Anda yakin ingin menghapus artikel ini?',
      async () => {
        try {
          const response = await fetch(`/api/project/delete`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ id: itemId }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          if (result.success) {
            showAlert('success', 'Artikel berhasil dihapus!');
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            showAlert('error', result.message || 'Failed to delete project');
          }
        } catch (error) {
          console.error('Error deleting project:', error);
          showAlert('error', 'An error occurred while deleting the project');
        }
      }
    );
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const openModal = () => {
    setError('');
    setIsEditing(false);
    setEditingItem(null);
    setSelectedImage(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setSelectedImage(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditingItem(null);
    // Reset form when closing modal
    setFormData({
      name: '',
      technologies: '',
      website: '',
      github: '',
      youtube: '' // Add YouTube to reset
    });
  };

  // Alert Component
  const Alert = ({ type, message, onClose }) => {
    const alertStyles = {
      success: 'bg-green-500 text-white-500',
      error: 'bg-orange-500 text-white-500',
      warning: 'bg-green-500 text-white-500',
      info: 'bg-blue-500 text-white-500'
    };

    return (
      <div className={`flex items-center text-white-500 ${alertStyles[type]} text-white-500 text-sm font-bold px-4 py-3 rounded-lg mb-4 shadow-lg`} role="alert">
        <p className="flex-1 text-white-500">{message}</p>
        <button 
          onClick={onClose}
          className="ml-4 text-white-500 hover:text-gray-200 font-bold text-lg"
        >
          ×
        </button>
      </div>
    );
  };

  // Confirm Dialog Component
  const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
    <>
      <div className="fixed inset-0 bg-white-500 bg-opacity-50 z-50"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white-500 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-semibold text-orange-500">Konfirmasi</h3>
            </div>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-white-500 bg-blue-500 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onCancel();
                }}
                className="px-4 py-2 bg-orange-500 text-white-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

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
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600 border border-green-500'
            }`}
          >
            Previous
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
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
    <div className="w-full p-1">
      {/* Alert notifications */}
      {alert.show && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert({ show: false, type: '', message: '' })}
          />
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog.show && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog({ show: false, message: '', onConfirm: null })}
        />
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Existing Projects Table */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Berita & Artikel</h2>
            <button
              onClick={openModal}
              className="px-2 py-1 mt-2 bg-green1-500 text-white-500 rounded-lg hover:bg-green-600 transition-all duration-200 shadow-lg font-semibold"
            >
              Tambah Konten
            </button>
          </div>
          
          {data && data.length ? (
            <>
              <div className="w-full">
                <table className="w-full table-fixed divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-20 px-3 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Gambar</th>
                      <th className="w-64 px-3 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Judul</th>
                      <th className="w-60 px-3 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Deskripsi</th>
                      <th className="w-32 px-3 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Penulis</th>
                      <th className="w-24 px-3 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Kategori</th>
                      <th className="w-28 px-3 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Tanggal</th>
                      <th className="w-42 px-3 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-4">
                          {item.image ? (
                            <div className="relative w-14 h-14 flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover rounded-lg shadow-sm"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-4">
                          <div className="text-sm font-medium text-gray-900 break-words text-center">
                            {truncateText(item.name, 60)}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="text-sm text-gray-900 break-words text-justify">
                            {truncateText(item.technologies, 80)}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="text-sm text-gray-900 break-words text-center">
                            {truncateText(item.website || 'N/A', 20)}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize text-center">
                            {item.github || 'N/A'}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <div className="text-xs text-white text-center">
                            {new Date(item.createdAt).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-center">
                        <div className="flex flex-row items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-2 py-1 text-xs font-medium rounded text-white-500 bg-orange-200 hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="px-2 py-1 text-xs font-medium rounded text-white-500 bg-orange-500 hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
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
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📁</div>
              <p className="text-gray-500 text-lg">No projects found</p>
              <p className="text-gray-400 text-sm">Click "Tambah Artikel Baru" to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal with New Layout */}
      {isModalOpen && (
        <>
          {/* Modal Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

        {/* Modal Content */}
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden relative">
            {/* Modal Header */}
            <div className="bg-white-500 p-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {isEditing ? 'Edit Artikel & Berita' : 'Tambah Artikel & Berita Baru'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 text-2xl font-light transition-colors p-1 hover:bg-blue-700 rounded-full"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="bg-white-500 p-4 overflow-y-auto max-h-[calc(85vh-100px)]">
              <form onSubmit={handleSubmitProject} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded-lg">
                    <div className="flex">
                      <div className="text-red-500 font-medium text-sm">⚠️ Error:</div>
                      <div className="ml-2 text-red-700 text-sm">{error}</div>
                    </div>
                  </div>
                )}

                {/* Judul - Full Width */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Judul Artikel atau Berita *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    placeholder="Masukkan judul artikel atau berita"
                  />
                </div>

                {/* Kategori dan Penulis - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Kategori *
                    </label>
                    <select
                      name="github"
                      value={formData.github}
                      onChange={(e) => setFormData({...formData, github: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Penulis
                    </label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                      placeholder="Masukkan nama penulis"
                    />
                  </div>
                </div>

                {/* Link YouTube - Full Width */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Link Video Dokumentasi YouTube (Opsional)
                  </label>
                  <input
                    type="url"
                    name="youtube"
                    value={formData.youtube || ''}
                    onChange={(e) => setFormData({...formData, youtube: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Masukkan link YouTube jika artikel memiliki video terkait
                  </p>
                </div>

                {/* Deskripsi - Large Text Area */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Deskripsi atau Isi Berita dan artikel *
                  </label>
                  <textarea
                    name="technologies"
                    value={formData.technologies}
                    onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-vertical text-sm"
                    placeholder="Masukkan deskripsi atau isi berita secara detail..."
                  />
                </div>

                {/* Image Upload Section */}
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Gambar Artikel atau Berita
                  </label>
                  
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white text-sm"
                    />
                    <p className="text-xs text-gray-600">
                      Format yang didukung: JPEG, PNG , jpg. Ukuran maksimal: 5MB
                    </p>
                    {isEditing && !selectedImage && (
                      <p className="text-xs text-blue-600">
                        Biarkan kosong jika tidak ingin mengubah gambar
                      </p>
                    )}
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Preview Gambar
                      </label>
                      <div className="relative w-full max-w-xs mx-auto">
                        <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden shadow-md bg-white">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-md"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 bg-gray-50 p-3 rounded-lg">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-orange-500 text-white-500 rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-md text-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2 font-medium rounded-lg transition-all duration-200 shadow-md text-sm ${
                      isLoading 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-blue-500 text-white-500 hover:bg-green-700 hover:shadow-lg'
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEditing ? 'Mengupdate...' : 'Menambahkan...'}
                      </span>
                    ) : (isEditing ? 'Update Artikel' : 'Tambah Artikel')}
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