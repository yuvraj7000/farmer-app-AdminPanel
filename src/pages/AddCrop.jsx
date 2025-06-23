import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Trash, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { indianLanguages as languages } from '../utils/languages';
import DraggableImagePicker from '../components/DraggableImagePicker';


const AddCrop = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [cropName, setCropName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [paragraphs, setParagraphs] = useState([
    { language_code: 'en', paragraph_title: '', paragraph_content: '' }
  ]);

  // Available languages for dropdown
  // const languages = [
  //   { code: 'en', name: 'English' },
  //   { code: 'es', name: 'Spanish' },
  //   { code: 'fr', name: 'French' },
  //   { code: 'de', name: 'German' },
  //   { code: 'it', name: 'Italian' },
  //   { code: 'pt', name: 'Portuguese' },
  //   { code: 'zh', name: 'Chinese' },
  //   { code: 'ja', name: 'Japanese' },
  //   { code: 'hi', name: 'Hindi' },
  //   { code: 'ar', name: 'Arabic' }
  // ];

  const handleParagraphChange = (index, field, value) => {
    const updatedParagraphs = [...paragraphs];
    updatedParagraphs[index][field] = value;
    setParagraphs(updatedParagraphs);
  };

  const addParagraph = () => {
    setParagraphs([
      ...paragraphs,
      { language_code: 'en', paragraph_title: '', paragraph_content: '' }
    ]);
  };

  const removeParagraph = (index) => {
    const updatedParagraphs = [...paragraphs];
    updatedParagraphs.splice(index, 1);
    setParagraphs(updatedParagraphs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate form data
    if (!cropName.trim()) {
      setError('Crop name is required');
      setLoading(false);
      return;
    }
    
    if (!paragraphs.every(p => p.paragraph_title.trim() && p.paragraph_content.trim())) {
      setError('All paragraph titles and content are required');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/v1/crop/add`, {
        name: cropName,
        image_url: imageUrl,
        paragraphs: paragraphs
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/crops'); // Redirect to crops list after successful submission
      }, 2000);
    } catch (err) {
      console.error('Error adding crop:', err);
      setError(err.response?.data?.message || 'Failed to add crop');
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
          <h1 className="text-2xl font-bold">Add New Crop</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Crop added successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-4">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Crop Name *
            </label>
            <input
              id="name"
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter crop name"
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

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Paragraphs</h2>
              <button
                type="button"
                onClick={addParagraph}
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md flex items-center text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Paragraph
              </button>
            </div>

            {paragraphs.map((paragraph, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">Paragraph {index + 1}</h3>
                  {paragraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParagraph(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Language
                  </label>
                  <select
                    value={paragraph.language_code}
                    onChange={(e) => handleParagraphChange(index, 'language_code', e.target.value)}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={paragraph.paragraph_title}
                    onChange={(e) => handleParagraphChange(index, 'paragraph_title', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter paragraph title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Content *
                  </label>
                  <textarea
                    value={paragraph.paragraph_content}
                    onChange={(e) => handleParagraphChange(index, 'paragraph_content', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="4"
                    placeholder="Enter paragraph content"
                    required
                  />
                </div>
              </div>
            ))}
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
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Crop'}
            </button>
          </div>
        </form>
      </div>
      <DraggableImagePicker/>
    </div>
  );
};

export default AddCrop;