import React, { useState, useRef, useEffect } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { thumbnail, scale, fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { quality } from "@cloudinary/url-gen/actions/delivery";

const DraggableImagePicker = ({ onImageSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [imagePublicId, setImagePublicId] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize Cloudinary
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'ddwaclmzc'
    }
  });
  
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const urlInputRef = useRef(null);

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.includes('cloudinary')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Reset copy success message after 2 seconds
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const handleMouseDown = (e) => {
    if (e.target.className.includes('drag-handle')) {
      setIsDragging(true);
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.preventDefault();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Reset upload state
      setImageUrl(null);
      setImagePublicId(null);
      setError(null);
      
      // Notify parent component
      if (onImageSelect) {
        onImageSelect(file);
      }
    }
  };

  const uploadToCloudinary = async () => {
    if (!selectedImage) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    const cloudName = 'ddwaclmzc'; // Your Cloudinary cloud name
    const uploadPreset = 'KisanBandhu'; // Your upload preset
    
    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('upload_preset', uploadPreset);
    
    try {
      // Create XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      });
      
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
      
      xhr.onload = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setImageUrl(response.secure_url);
          setImagePublicId(response.public_id);
          setIsUploading(false);
          
          // Notify parent component of uploaded URL
          if (onImageSelect) {
            onImageSelect(response.secure_url);
          }
        } else {
          setError('Upload failed');
          setIsUploading(false);
        }
      };
      
      xhr.onerror = function() {
        setError('Network error during upload');
        setIsUploading(false);
      };
      
      xhr.send(formData);
    } catch (err) {
      setError('Error uploading image: ' + err.message);
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const clearSelectedImage = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
    setPreviewUrl(null);
    setImageUrl(null);
    setImagePublicId(null);
    setError(null);
    fileInputRef.current.value = '';
    if (onImageSelect) {
      onImageSelect(null);
    }
  };

  const copyToClipboard = () => {
    if (urlInputRef.current) {
      urlInputRef.current.select();
      document.execCommand('copy');
      setCopySuccess(true);
    }
  };

  // Generate optimized thumbnail URL for preview
  const getOptimizedImage = () => {
    if (!imagePublicId) return null;
    
    const img = cld.image(imagePublicId);
    img.resize(fill().width(300).height(300).gravity(autoGravity()))
       .delivery(quality('auto'));
    
    return img;
  };

  return (
    <div
      ref={containerRef}
      className="fixed shadow-lg rounded-lg z-50 bg-white border border-gray-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isExpanded ? '300px' : '70px',
        height: isExpanded ? (imageUrl ? '400px' : '320px') : '45px',
        transition: 'width 0.3s, height 0.3s',
        overflow: 'hidden'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Drag handle and toggle button */}
      <div 
        className="drag-handle bg-blue-500 text-white p-2 flex justify-between items-center cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="drag-handle font-medium text-sm">
          {isExpanded ? 'Image Picker' : ''}
        </div>
        <button
          onClick={toggleExpand}
          className="p-1 rounded-full hover:bg-blue-600 focus:outline-none"
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Content area - only visible when expanded */}
      {isExpanded && (
        <div className="p-4">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center cursor-pointer hover:border-blue-500 mb-4"
            onClick={triggerFileInput}
          >
            {previewUrl ? (
              <div className="relative w-full h-full">
                {imagePublicId ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <AdvancedImage 
                      cldImg={getOptimizedImage()} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-contain" 
                  />
                )}
                <button 
                  onClick={clearSelectedImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-1 text-sm text-gray-500">Click to select an image</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Error message */}
          {error && (
            <div className="mb-4 text-sm text-red-500 p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {/* Image URL and copy button */}
          {imageUrl && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <div className="flex">
                <input
                  ref={urlInputRef}
                  type="text"
                  value={imageUrl}
                  readOnly
                  className="flex-1 p-2 text-xs border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-r-md border border-l-0"
                  title="Copy to clipboard"
                >
                  {copySuccess ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  )}
                </button>
              </div>
              {copySuccess && (
                <p className="text-xs text-green-600 mt-1">URL copied to clipboard!</p>
              )}
            </div>
          )}

          {/* Buttons */}
          {selectedImage && !imageUrl && !isUploading && (
            <button
              onClick={uploadToCloudinary}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors mb-2"
            >
              Upload to Cloudinary
            </button>
          )}

          {/* Upload progress */}
          {isUploading && (
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1 text-center">Uploading... {uploadProgress}%</p>
            </div>
          )}

          <button
            onClick={triggerFileInput}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            {selectedImage ? 'Change Image' : 'Choose Image'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DraggableImagePicker;