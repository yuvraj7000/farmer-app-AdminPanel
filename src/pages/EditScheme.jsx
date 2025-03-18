import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditScheme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: id,
    type: '',
    gov_level: '',
    state_or_org: '',
    start_date: '',
    end_date: '',
    status: 'ACTIVE',
    official_link: '',
    funding_amount: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/schemes/get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ language_code: 'en' }) // Assuming English for edit
        });

        if (!response.ok) throw new Error('Failed to fetch scheme');
        
        const data = await response.json();
        const scheme = data.schemes.find(s => s.id === parseInt(id));
        
        if (!scheme) throw new Error('Scheme not found');
        
        setFormData({
          ...formData,
          type: scheme.type,
          gov_level: scheme.gov_level || '',
          state_or_org: scheme.state_or_org,
          start_date: scheme.start_date.split('T')[0],
          end_date: scheme.end_date.split('T')[0],
          status: scheme.status,
          official_link: scheme.official_link,
          funding_amount: scheme.funding_amount,
          image_url: scheme.image_url
        });
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/v1/schemes/updateScheme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          funding_amount: Number(formData.funding_amount),
          gov_level: formData.gov_level || null
        }),
      });

      if (!response.ok) throw new Error('Failed to update scheme');
      
      setMessage('Scheme updated successfully!');
      setTimeout(() => navigate('/schemes'), 2000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Scheme</h1>
      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Type</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Government Level</label>
            <select
              name="gov_level"
              value={formData.gov_level}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Level</option>
              <option value="Central">Central</option>
              <option value="State">State</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">State/Organization</label>
            <input
              type="text"
              name="state_or_org"
              value={formData.state_or_org}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Funding Amount</label>
            <input
              type="number"
              name="funding_amount"
              value={formData.funding_amount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Official Link</label>
            <input
              type="url"
              name="official_link"
              value={formData.official_link}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/schemes')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            Update Scheme
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditScheme;