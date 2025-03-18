import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MoreVertical, Plus, Trash, Pencil } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch crops data on component mount
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/v1/crop/all');
      setCrops(response.data.crops);
      setError(null);
    } catch (err) {
      setError('Failed to fetch crops');
      console.error('Error fetching crops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCrop = async (name) => {
    try {
      await axios.post(`http://localhost:4000/api/v1/crop/delete`,{name});
      // Update the state to remove the deleted crop
      setCrops(crops.filter(crop => crop.name !== name));
      setOpenMenuId(null);
      setConfirmDelete(false);
    } catch (err) {
      console.error('Error deleting crop:', err);
      alert('Failed to delete crop');
    }
  };

  const handleUpdateCrop = (crop) => {
    // Navigate to update page with crop data
    navigate('/updateCrop', { state: { cropData: crop } });
    setOpenMenuId(null);
  };

  const handleEditCropPara = (crop) => {
   
    navigate(`/editCropPara/${crop.name}`);
    setOpenMenuId(null);
  };

  const handleAddCrop = () => {
    navigate('/addCrop');
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
    setConfirmDelete(false); // Reset confirm delete when toggling menu
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading crops...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Crops</h1>
        <button 
          onClick={handleAddCrop}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Crop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <div key={crop.id} className="bg-white rounded-lg border overflow-hidden">
            <div className="relative h-48 bg-gray-200">
              {crop.image_url ? (
                <img 
                  src={crop.image_url} 
                  alt={crop.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No image available
                </div>
              )}
              <div className="absolute top-2 right-2">
                <button 
                  onClick={() => toggleMenu(crop.id)}
                  className="p-1 bg-white rounded-full shadow-md"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                
                {openMenuId === crop.id && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10">
                    <button 
                      onClick={() => handleUpdateCrop(crop)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Update Crop
                    </button>
                    <button 
                      onClick={() => handleEditCropPara(crop)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Update Para
                    </button>
                    {!confirmDelete ? (
                      <button 
                        onClick={() => setConfirmDelete(true)}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleDeleteCrop(crop.name)}
                          className="flex items-center w-full px-4 py-2 text-xs text-red-600 hover:bg-gray-100"
                        >
                          Confirm Delete
                        </button>
                        <button 
                          onClick={() => setConfirmDelete(false)}
                          className="flex items-center w-full px-4 py-2 text-xs text-gray-600 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{crop.name}</h2>
              <p className="text-sm text-gray-500">ID: {crop.id}</p>
            </div>
          </div>
        ))}
      </div>

      {crops.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No crops found. Add a new crop to get started.
        </div>
      )}
    </div>
  );
};

export default Crops;