import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { indianLanguages } from '../utils/languages';
import { PlusCircle, MoreVertical, Calendar, Link as LinkIcon, Edit, Trash2, Globe, AlertTriangle } from 'lucide-react';

const Schemes = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [schemeToDelete, setSchemeToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/schemes/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language_code: selectedLanguage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch schemes');
      }

      const data = await response.json();
      setSchemes(data.schemes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [selectedLanguage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
      status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {status}
    </span>
  );

  const handleDelete = async (schemeId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/schemes/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: schemeId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete scheme');
      }

      // Refresh the schemes list
      await fetchSchemes();
      setShowDeleteModal(false);
      setSchemeToDelete(null);
      setOpenMenuId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const openDeleteModal = (schemeId) => {
    setSchemeToDelete(schemeId);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const CardMenu = ({ schemeId, event }) => {
    // Stop propagation to prevent the dropdown from closing immediately
    const handleClick = (e) => {
      e.stopPropagation();
    };

    return (
      <div 
        className="absolute right-2 top-10 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        onClick={handleClick}
      >
        <div className="py-1">
          <button 
            onClick={() => navigate(`/edit-scheme/${schemeId}`)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <Edit size={16} />
            Edit scheme
          </button>
          <button 
            onClick={() => navigate(`/edit-translation/${schemeId}`)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <Globe size={16} />
            Edit Translation
          </button>
          <button 
            onClick={() => openDeleteModal(schemeId)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    );
  };

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-center mb-4 text-red-500">
          <AlertTriangle size={40} />
        </div>
        <h3 className="text-lg font-semibold text-center mb-2">Confirm Deletion</h3>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete this scheme? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(schemeToDelete)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200 text-red-600 m-6">
      <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Error Loading Schemes</h3>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Government Schemes</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/addSchemes")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <PlusCircle size={18} />
            Add New Scheme
          </button>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Language:</label>
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {indianLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {schemes.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No schemes found for the selected language.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
              <div className="relative">
                <img 
                  src={scheme.image_url || 'https://via.placeholder.com/300x150?text=No+Image'} 
                  alt={scheme.name} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x150?text=Error+Loading+Image';
                  }}
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === scheme.id ? null : scheme.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <MoreVertical size={16} className="text-gray-600" />
                </button>
                {openMenuId === scheme.id && <CardMenu schemeId={scheme.id} />}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold line-clamp-2">{scheme.name}</h3>
                  <StatusBadge status={scheme.status} />
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">{scheme.type}</span>
                  <span className="inline-block px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md">{scheme.gov_level}</span>
                  <span className="inline-block px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-md">{scheme.state_or_org}</span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {scheme.description || 'No description available'}
                </p>

                <div className="pt-3 border-t flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDate(scheme.start_date)} - {formatDate(scheme.end_date)}</span>
                  </div>
                  
                  {scheme.official_link && (
                    <a 
                      href={scheme.official_link} 
                      className="flex items-center text-sm font-medium text-green-600 hover:text-green-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkIcon size={14} className="mr-1" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && <DeleteConfirmationModal />}
    </div>
  );
};

export default Schemes;