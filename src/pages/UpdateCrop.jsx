import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const UpdateCrop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cropData = location.state?.cropData; // Get crop data passed from the Crops component
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [oldName, setOldName] = useState('');
  const [newName, setNewName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // If crop data was passed through navigation, initialize the form
    if (cropData) {
      setOldName(cropData.name);
      setNewName(cropData.name);
      setImageUrl(cropData.image_url || '');
    }
  }, [cropData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate form data
    if (!newName.trim()) {
      setError('Crop name is required');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:4000/api/v1/crop/update', {
        old_name: oldName,
        new_name: newName,
        image_url: imageUrl
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/crops'); // Redirect to crops list after successful update
      }, 2000);
    } catch (err) {
      console.error('Error updating crop:', err);
      setError(err.response?.data?.message || 'Failed to update crop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/crops')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
          </button>
          <h1 className="text-2xl font-bold">Update Crop</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Crop updated successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-4">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Original Crop Name
            </label>
            <input
              type="text"
              value={oldName}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"
              disabled
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newName">
              New Crop Name *
            </label>
            <input
              id="newName"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter new crop name"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
              Image URL
            </label>
            <input
              id="imageUrl"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/crops')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Crop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCrop;