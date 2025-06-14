"use client";

import { useState } from "react";
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProject = async () => {
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name || '');
      formDataToSend.append('technologies', formData.technologies || '');
      formDataToSend.append('website', formData.website || '');
      formDataToSend.append('github', formData.github || '');
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await fetch('/api/project/add', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        alert('Project added successfully!');
        // Reset form
        setFormData({
          name: '',
          technologies: '',
          website: '',
          github: ''
        });
        setSelectedImage(null);
        setImagePreview(null);
        // Refresh data
        window.location.reload();
      } else {
        alert(result.message || 'Failed to add project');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the project');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="w-full">
      <div className="bg-[#ffffff] shadow-md rounded px-8 pt-6 pb-8 mb-4">
        
        {/* Display existing projects */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Existing Projects</h2>
          {data && data.length ? (
            <div className="grid gap-4">
              {data.map((item, index) => (
                <div key={index} className="flex flex-col gap-4 border p-4 border-green-600 rounded">
                  {item.image && (
                    <div className="relative w-full h-48">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <p><strong>Name:</strong> {item.name}</p>
                  <p><strong>Technologies:</strong> {item.technologies}</p>
                  <p><strong>Website:</strong> {item.website}</p>
                  <p><strong>Github:</strong> {item.github}</p>
                  <p><strong>Created:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No projects found</p>
          )}
        </div>

        {/* Add new project form */}
        <div className="border-t pt-6">
          <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
          
          <FormControls
            controls={controls}
            formData={formData}
            setFormData={setFormData}
          />

          {/* Image upload section */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Project Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: JPEG, PNG, WebP. Max size: 5MB
            </p>
          </div>

          {/* Image preview */}
          {imagePreview && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Image Preview
              </label>
              <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmitProject}
            disabled={isLoading}
            className={`mt-[10px] border p-4 font-bold text-[16px] rounded ${
              isLoading 
                ? 'border-gray-400 text-gray-400 cursor-not-allowed' 
                : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
            } transition-colors`}
          >
            {isLoading ? 'Adding Project...' : 'Add Project'}
          </button>
        </div>
      </div>
    </div>
  );
}