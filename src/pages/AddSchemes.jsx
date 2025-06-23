import React, { useState } from 'react';
import { indianLanguages } from '../utils/languages';
import DraggableImagePicker from '../components/DraggableImagePicker';

const AddSchemes = () => {
  const [formData, setFormData] = useState({
    type: '',
    gov_level: '',
    state_or_org: '',
    start_date: '',
    end_date: '',
    status: 'ACTIVE',
    official_link: '',
    funding_amount: '',
    image_url: '',
    language_data: [{
      language_code: 'en',
      name: '',
      description: '',
      benefits: [],
      eligibility: [],
      application_process: []
    }]
  });
  const [currentBenefit, setCurrentBenefit] = useState('');
  const [currentEligibility, setCurrentEligibility] = useState('');
  const [currentProcess, setCurrentProcess] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e, langIndex, field) => {
    const { name, value } = e.target;
    if (langIndex !== undefined) {
      const updatedLanguages = [...formData.language_data];
      updatedLanguages[langIndex][field] = value;
      setFormData({ ...formData, language_data: updatedLanguages });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayAdd = (arrayName, value, langIndex) => {
    if (!value) return;
    const updatedLanguages = [...formData.language_data];
    updatedLanguages[langIndex][arrayName].push(value);
    setFormData({ ...formData, language_data: updatedLanguages });
    
    // Clear current input
    if (arrayName === 'benefits') setCurrentBenefit('');
    if (arrayName === 'eligibility') setCurrentEligibility('');
    if (arrayName === 'application_process') setCurrentProcess('');
  };

  const handleRemoveItem = (arrayName, index, langIndex) => {
    const updatedLanguages = [...formData.language_data];
    updatedLanguages[langIndex][arrayName].splice(index, 1);
    setFormData({ ...formData, language_data: updatedLanguages });
  };

  const addLanguageSection = () => {
    setFormData({
      ...formData,
      language_data: [...formData.language_data, {
        language_code: 'en',
        name: '',
        description: '',
        benefits: [],
        eligibility: [],
        application_process: []
      }]
    });
  };

  const removeLanguageSection = (index) => {
    const updatedLanguages = formData.language_data.filter((_, i) => i !== index);
    setFormData({ ...formData, language_data: updatedLanguages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/schemes/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          funding_amount: Number(formData.funding_amount)
        }),
      });

      if (!response.ok) throw new Error('Failed to add scheme');
      
      setMessage('Scheme added successfully!');
      setTimeout(() => setMessage(''), 3000);
      // Reset form
      setFormData({
        type: '',
        gov_level: '',
        state_or_org: '',
        start_date: '',
        end_date: '',
        status: 'ACTIVE',
        official_link: '',
        funding_amount: '',
        image_url: '',
        language_data: [{
          language_code: 'en',
          name: '',
          description: '',
          benefits: [],
          eligibility: [],
          application_process: []
        }]
      });
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Scheme</h1>
      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Common Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={(e) => handleInputChange(e)}
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
              onChange={(e) => handleInputChange(e)}
              className="w-full p-2 border rounded"
              required
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
              onChange={(e) => handleInputChange(e)}
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
              onChange={(e) => handleInputChange(e)}
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
              onChange={(e) => handleInputChange(e)}
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
              onChange={(e) => handleInputChange(e)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={(e) => handleInputChange(e)}
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
              onChange={(e) => handleInputChange(e)}
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
              onChange={(e) => handleInputChange(e)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Language Sections */}
        {formData.language_data.map((lang, langIndex) => (
          <div key={langIndex} className="border p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Language Version {langIndex + 1}</h3>
              {langIndex > 0 && (
                <button
                  type="button"
                  onClick={() => removeLanguageSection(langIndex)}
                  className="text-red-600 text-sm"
                >
                  Remove Language
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={lang.language_code}
                  onChange={(e) => handleInputChange(e, langIndex, 'language_code')}
                  className="w-full p-2 border rounded"
                  required
                >
                  {indianLanguages.map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.name}
                    </option>
                  ))}

                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Scheme Name</label>
                <input
                  type="text"
                  value={lang.name}
                  onChange={(e) => handleInputChange(e, langIndex, 'name')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={lang.description}
                  onChange={(e) => handleInputChange(e, langIndex, 'description')}
                  className="w-full p-2 border rounded"
                  rows="3"
                  required
                />
              </div>

              {/* Benefits */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Benefits</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentBenefit}
                    onChange={(e) => setCurrentBenefit(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Add benefit"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayAdd('benefits', currentBenefit, langIndex)}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {lang.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{benefit}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('benefits', index, langIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repeat similar blocks for Eligibility and Application Process */}
              {/* Eligibility */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Eligibility</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentEligibility}
                    onChange={(e) => setCurrentEligibility(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Add eligibility"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayAdd('eligibility', currentEligibility, langIndex)}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {lang.eligibility.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('eligibility', index, langIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Process */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Application Process</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentProcess}
                    onChange={(e) => setCurrentProcess(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Add process step"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayAdd('application_process', currentProcess, langIndex)}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {lang.application_process.map((step, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{step}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('application_process', index, langIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addLanguageSection}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Add Another Language
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            Submit Scheme
          </button>
        </div>
      </form>
      <DraggableImagePicker/>
    </div>
  );
};

export default AddSchemes;