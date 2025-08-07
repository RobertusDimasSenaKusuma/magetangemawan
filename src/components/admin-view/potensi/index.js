"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";

export default function AdminPotensiView({ 
  formData, 
  setFormData, 
  handleSaveData, 
  data, 
  update, 
  setUpdate 
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
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

  const kategoriOptions = [
    { value: "", label: "Pilih Kategori" },
    { value: "UMKM", label: "UMKM" },
    { value: "Wisata", label: "Wisata" },
    { value: "Pertanian", label: "Pertanian" },
    { value: "Peternakan", label: "Peternakan" },
    { value: "Kerajinan", label: "Kerajinan" },
    { value: "Situs", label: "Situs" },
     { value: "Budaya", label: "Budaya" },
    { value: "Lainnya", label: "Lainnya" }
  ];

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
        setError('Please select a valid image file (JPEG, PNG, JPG)');
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

  const handleSubmitPotensi = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.nama || !formData.kategori || !formData.deskripsi || !formData.tahun_mulai || !formData.lokasi) {
        setError('Nama, kategori, deskripsi, tahun mulai, dan lokasi wajib diisi');
        setIsLoading(false);
        return;
      }

      const formDataToSend = new FormData();

      // Tambahkan ID jika sedang dalam mode edit
      if (isEditing && editingItem?._id) {
        formDataToSend.append("id", editingItem._id);
      }

      formDataToSend.append('nama', formData.nama.trim());
      formDataToSend.append('kategori', formData.kategori.trim());
      formDataToSend.append('deskripsi', formData.deskripsi.trim());
      formDataToSend.append('tahun_mulai', formData.tahun_mulai.toString());
      formDataToSend.append('lokasi', formData.lokasi.trim());
      formDataToSend.append('maps_link', formData.maps_link?.trim() || '');
      formDataToSend.append('shopee_link', formData.shopee_link?.trim() || '');
      formDataToSend.append('facebook_link', formData.facebook_link?.trim() || '');
      formDataToSend.append('instagram_link', formData.instagram_link?.trim() || '');
      formDataToSend.append('whatsapp_link', formData.whatsapp_link?.trim() || '');

      if (selectedImage) {
        formDataToSend.append('foto', selectedImage);
      }

      const url = isEditing ? `/api/potensi/update` : '/api/potensi/add';
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
        resetForm();
        setIsModalOpen(false);
        setError('');
        showAlert('success', isEditing ? 'Potensi berhasil diupdate!' : 'Potensi berhasil ditambahkan!');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setError(result.message || `Gagal ${isEditing ? 'mengupdate' : 'menambahkan'} potensi`);
      }

    } catch (error) {
      console.error(`Error saat ${isEditing ? 'update' : 'tambah'}:`, error);
      setError(error.message || `Terjadi kesalahan saat ${isEditing ? 'update' : 'tambah'} potensi`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    console.log('Editing item:', item);
    setEditingItem(item);
    setIsEditing(true);
    setFormData({
      nama: item.nama || '',
      kategori: item.kategori || '',
      deskripsi: item.deskripsi || '',
      tahun_mulai: item.tahun_mulai || '',
      lokasi: item.lokasi || '',
      maps_link: item.maps_link || '',
      shopee_link: item.shopee_link || '',
      facebook_link: item.facebook_link || '',
      instagram_link: item.instagram_link || '',
      whatsapp_link: item.whatsapp_link || ''
    });
    if (item.foto) {
      setImagePreview(item.foto);
    }
    setSelectedImage(null);
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (itemId) => {
    showConfirmDialog(
      'Apakah Anda yakin ingin menghapus potensi ini?',
      async () => {
        try {
          const response = await fetch(`/api/potensi/delete`, {
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
            showAlert('success', 'Potensi berhasil dihapus!');
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            showAlert('error', result.message || 'Failed to delete potensi');
          }
        } catch (error) {
          console.error('Error deleting potensi:', error);
          showAlert('error', 'An error occurred while deleting the potensi');
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
    setShowOptionalFields(false);
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setSelectedImage(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditingItem(null);
    setShowOptionalFields(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      kategori: "",
      deskripsi: "",
      tahun_mulai: "",
      lokasi: "",
      maps_link: "",
      shopee_link: "",
      facebook_link: "",
      instagram_link: "",
      whatsapp_link: "",
    });
    setImagePreview(null);
    setSelectedImage(null);
    setUpdate(false);
  };

  // Alert Component
  const Alert = ({ type, message, onClose }) => {
    const alertStyles = {
      success: 'bg-green-500 text-white-500',
      error: 'bg-orange-500 text-white-500',
      warning: 'bg-green1-500 text-white-500',
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
              <h3 className="text-orange-500 text-lg font-semibold text-gray-900">Konfirmasi</h3>
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
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} potensi
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
        {/* Data Potensi Table */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Data Potensi</h2>
            <button
              onClick={openModal}
              className="px-2 py-1 mt-2 bg-green1-500 text-white-500 rounded-lg hover:bg-green-600 transition-all duration-200 shadow-lg font-semibold"
            >
              Tambah Potensi 
            </button>
          </div>
          
          {data && data.length ? (
            <>
              <div className="w-full">
                <table className="w-full table-fixed divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-20 px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Foto</th>
                      <th className="w-64 px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nama</th>
                      <th className="w-32 px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Kategori</th>
                      <th className="w-60 px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Deskripsi</th>
                      <th className="w-24 px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Tahun</th>
                      <th className="w-40 px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Lokasi</th>
                      <th className="w-32 px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3">
                          {item.foto ? (
                            <div className="relative w-14 h-14 flex-shrink-0">
                              <Image
                                src={item.foto}
                                alt={item.nama}
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
                        <td className="px-3 py-3">
                          <div className="text-sm font-medium text-gray-900 break-words text-center">
                            {truncateText(item.nama, 60)}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize text-center">
                            {item.kategori || 'N/A'}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm text-gray-900 break-words text-justify">
                            {truncateText(item.deskripsi, 80)}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm text-gray-900 break-words text-center">
                            {item.tahun_mulai || 'N/A'}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm text-gray-900 break-words text-center">
                            {truncateText(item.lokasi || 'N/A', 30)}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-row space-x-2">
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
              <p className="text-gray-500 text-lg">No potensi found</p>
              <p className="text-gray-400 text-sm">Click "Tambah Potensi Baru" to get started</p>
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
          <div className="bg-white-500 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden relative">
            {/* Modal Header */}
            <div className="bg-white-500 p-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {isEditing ? 'Edit Potensi' : 'Tambah Potensi Baru'}
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
            <div className="bg-white p-4 overflow-y-auto max-h-[calc(85vh-100px)]">
              <form onSubmit={handleSubmitPotensi} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded-lg">
                    <div className="flex">
                      <div className="text-red-500 font-medium text-sm">⚠️ Error:</div>
                      <div className="ml-2 text-red-700 text-sm">{error}</div>
                    </div>
                  </div>
                )}

                {/* Nama dan Kategori - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Nama Potensi 
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                      placeholder="Masukkan nama potensi"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Kategori 
                    </label>
                    <select
                      name="kategori"
                      value={formData.kategori}
                      onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                      required
                    >
                      {kategoriOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tahun Mulai dan Lokasi - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Tahun Unggah
                    </label>
                    <input
                      type="number"
                      name="tahun_mulai"
                      value={formData.tahun_mulai}
                      onChange={(e) => setFormData({...formData, tahun_mulai: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                      placeholder="2020"
                      min="1900"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Lokasi 
                    </label>
                    <input
                      type="text"
                      name="lokasi"
                      value={formData.lokasi}
                      onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                      placeholder="Dusun/Desa, Kecamatan"
                      required
                    />
                  </div>
                </div>

                {/* Deskripsi - Full Width */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Deskripsi 
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-vertical text-sm"
                    placeholder="Masukkan deskripsi potensi secara detail..."
                    required
                  />
                </div>

                {/* Image Upload Section */}
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Foto Potensi
                  </label>
                  
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white text-sm"
                    />
                    <p className="text-xs text-gray-600">
                      Format yang didukung: JPEG, PNG, JPG. Ukuran maksimal: 5MB
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

                {/* Toggle Optional Fields */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    {showOptionalFields ? <FaEyeSlash /> : <FaEye />}
                    <span>
                      {showOptionalFields ? "Sembunyikan" : "Tampilkan"} Informasi Opsional (Link Media Sosial)
                    </span>
                  </button>
                </div>

                {/* Optional Fields */}
                {showOptionalFields && (
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Link Media Sosial & Online</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Link Google Maps
                        </label>
                        <input
                          type="url"
                          name="maps_link"
                          value={formData.maps_link}
                          onChange={(e) => setFormData({...formData, maps_link: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                          placeholder="https://maps.google.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Link Shopee
                        </label>
                        <input
                          type="url"
                          name="shopee_link"
                          value={formData.shopee_link}
                          onChange={(e) => setFormData({...formData, shopee_link: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                          placeholder="https://shopee.co.id/..."
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Link Facebook
                        </label>
                        <input
                          type="url"
                          name="facebook_link"
                          value={formData.facebook_link}
                          onChange={(e) => setFormData({...formData, facebook_link: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                          placeholder="https://facebook.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Link Instagram
                        </label>
                        <input
                          type="url"
                          name="instagram_link"
                          value={formData.instagram_link}
                          onChange={(e) => setFormData({...formData, instagram_link: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Link WhatsApp
                      </label>
                      <input
                        type="url"
                        name="whatsapp_link"
                        value={formData.whatsapp_link}
                        onChange={(e) => setFormData({...formData, whatsapp_link: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                        placeholder="https://wa.me/..."
                      />
                    </div>
                  </div>
                )}

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
                    ) : (isEditing ? 'Update Potensi' : 'Tambah Potensi')}
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