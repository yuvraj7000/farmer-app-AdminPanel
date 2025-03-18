import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const Schemes = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);


  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/v1/schemes/get', {
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
    return date.toLocaleDateString('en-IN');
  };

  const StatusBadge = ({ status }) => (
    <span className={`px-2 py-1 text-sm rounded-full ${
      status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {status}
    </span>
  );

  const LanguageDropdown = () => (
    <select 
      value={selectedLanguage}
      onChange={(e) => setSelectedLanguage(e.target.value)}
      className="px-4 py-2 border rounded-md"
    >
      <option value="hi">Hindi</option>
      <option value="en">English</option>
      <option value="tn">Tamil</option>
    </select>
  );








  const handleDelete = async (schemeId) => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/schemes/delete', {
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
      setOpenMenuId(null);
    } catch (err) {
      setError(err.message);
    }
  };

 


  const CardMenu = ({ schemeId }) =>{ 
    const confirm = false;
    return(
    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="py-1">
        <button 
          onClick={() => navigate(`/edit-scheme/${schemeId}`)}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          Edit scheme
        </button>
        <button 
          onClick={() => navigate(`/edit-translation/${schemeId}`)}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          Edit Translation
        </button>
        <button 
          onClick={() => {
            setShowDeleteModal(true);
          }}
          className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
        >
          Delete
        </button>
        {showDeleteModal && <button 
          onClick={() => {
            handleDelete(schemeId);
          }}
          className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
        >
          confirm Delete
        </button>}
      </div>
    </div>
  );
}

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">

      <div className="flex justify-end mb-6">
        <button onClick={()=>{navigate("/addSchemes")}}>add</button>
        <LanguageDropdown />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme) => (
          <div key={scheme.id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 relative">
              <button 
                onClick={() => setOpenMenuId(openMenuId === scheme.id ? null : scheme.id)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
              >
                •••
              </button>
              {openMenuId === scheme.id && <CardMenu schemeId={scheme.id} />}

              <img 
                src={scheme.image_url} 
                alt={scheme.name} 
                className="w-full h-38 object-cover rounded-lg mb-4"
              />
              
              <div className="flex justify-between items-start ">
                <h3 className="text-xl font-semibold">{scheme.name}</h3>
                <StatusBadge status={scheme.status} />
              </div>
              <div>
                  <div className="text-xs text-gray-500 mb-2">
                    <span>{scheme.type}</span> • 
                    <span> {scheme.gov_level}</span> • 
                    <span> {scheme.state_or_org}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
  {scheme.description.split(' ').slice(0, 10).join(' ')}...
</p>

              

              <div className="mt-4 pt-4 border-t">
                <p className="text-sm">
                  {formatDate(scheme.start_date)} - {formatDate(scheme.end_date)}
                </p>
                <a 
                  href={scheme.official_link} 
                  className="text-blue-600 hover:underline mt-2 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                Website
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schemes;