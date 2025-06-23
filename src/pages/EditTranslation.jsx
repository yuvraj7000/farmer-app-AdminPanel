import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { indianLanguages } from '../utils/languages';

const EditTranslation = () => {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/schemes/getTranslationSchemes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ schemeId }),
        });

        if (!response.ok) throw new Error('Failed to fetch translations');
        
        const data = await response.json();
        setTranslations(data.schemes.map(t => ({
          ...t,
          currentBenefit: '',
          currentEligibility: '',
          currentProcess: '',
        })));
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [schemeId]);

  const handleArrayUpdate = (langIndex, field, value, index) => {
    const updatedTranslations = [...translations];
    updatedTranslations[langIndex][field][index] = value;
    setTranslations(updatedTranslations);
  };

  const handleAddItem = (langIndex, field, value) => {
    if (!value) return;
    const updatedTranslations = [...translations];
    updatedTranslations[langIndex][field].push(value);
    updatedTranslations[langIndex][`current${field.charAt(0).toUpperCase() + field.slice(1)}`] = '';
    setTranslations(updatedTranslations);
  };

  const handleRemoveItem = (langIndex, field, index) => {
    const updatedTranslations = [...translations];
    updatedTranslations[langIndex][field].splice(index, 1);
    setTranslations(updatedTranslations);
  };

  const handleUpdateTranslation = async (translation) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/schemes/updateTranslation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheme_id: schemeId,
          language_code: translation.language_code,
          name: translation.name,
          description: translation.description,
          benefits: translation.benefits,
          eligibility: translation.eligibility,
          application_process: translation.application_process
        }),
      });

      if (!response.ok) throw new Error('Failed to update translation');
      
      setMessage('Translation updated successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center p-4">Loading translations...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Translations</h1>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
      >
        Back to Schemes
      </button>
      
      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {translations.map((translation, langIndex) => (
          <div key={translation.id} className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
  {indianLanguages.find(lang => lang.code === translation.language_code)?.name || translation.language_code.toUpperCase()} Translation
</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={translation.name}
                  onChange={(e) => {
                    const updated = [...translations];
                    updated[langIndex].name = e.target.value;
                    setTranslations(updated);
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={translation.description}
                  onChange={(e) => {
                    const updated = [...translations];
                    updated[langIndex].description = e.target.value;
                    setTranslations(updated);
                  }}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>

              {/* Benefits Section */}
              <div>
                <label className="block text-sm font-medium mb-1">Benefits</label>
                <div className="space-y-2">
                  {translation.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleArrayUpdate(langIndex, 'benefits', e.target.value, index)}
                        className="flex-1 p-2 border rounded"
                      />
                      <button
                        onClick={() => handleRemoveItem(langIndex, 'benefits', index)}
                        className="px-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={translation.currentBenefit}
                      onChange={(e) => {
                        const updated = [...translations];
                        updated[langIndex].currentBenefit = e.target.value;
                        setTranslations(updated);
                      }}
                      className="flex-1 p-2 border rounded"
                      placeholder="Add new benefit"
                    />
                    <button
                      onClick={() => handleAddItem(langIndex, 'benefits', translation.currentBenefit)}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Repeat similar structure for Eligibility and Application Process */}
              {/* Eligibility Section */}
              <div>
                <label className="block text-sm font-medium mb-1">Eligibility</label>
                <div className="space-y-2">
                  {translation.eligibility.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayUpdate(langIndex, 'eligibility', e.target.value, index)}
                        className="flex-1 p-2 border rounded"
                      />
                      <button
                        onClick={() => handleRemoveItem(langIndex, 'eligibility', index)}
                        className="px-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={translation.currentEligibility}
                      onChange={(e) => {
                        const updated = [...translations];
                        updated[langIndex].currentEligibility = e.target.value;
                        setTranslations(updated);
                      }}
                      className="flex-1 p-2 border rounded"
                      placeholder="Add new eligibility"
                    />
                    <button
                      onClick={() => handleAddItem(langIndex, 'eligibility', translation.currentEligibility)}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Application Process Section */}
              <div>
                <label className="block text-sm font-medium mb-1">Application Process</label>
                <div className="space-y-2">
                  {translation.application_process.map((step, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => handleArrayUpdate(langIndex, 'application_process', e.target.value, index)}
                        className="flex-1 p-2 border rounded"
                      />
                      <button
                        onClick={() => handleRemoveItem(langIndex, 'application_process', index)}
                        className="px-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={translation.currentProcess}
                      onChange={(e) => {
                        const updated = [...translations];
                        updated[langIndex].currentProcess = e.target.value;
                        setTranslations(updated);
                      }}
                      className="flex-1 p-2 border rounded"
                      placeholder="Add new step"
                    />
                    <button
                      onClick={() => handleAddItem(langIndex, 'application_process', translation.currentProcess)}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleUpdateTranslation(translation)}
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
              >
                Update {translation.language_code.toUpperCase()} Translation
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditTranslation;