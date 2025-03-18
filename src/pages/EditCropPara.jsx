import { useState, useEffect, memo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { MoreVertical, Plus } from 'lucide-react';
import axios from 'axios';

const Paragraph = memo(({ 
    para,
    index,
    showOption,
    editOption,
    editedTitle,
    editedContent,
    setShowOption,
    setEditOption,
    setEditedTitle,
    setEditedContent,
    handleUpdateParagraph,
    handleDeleteParagraph
  }) => {
    return (
      <div className='mb-4 border p-4 relative'>
        <div className='absolute right-4 top-4'>
          <button onClick={() => setShowOption(showOption === index ? null : index)}>
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          
          {showOption === index && (
            <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg origin-top-right right-0 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <button 
                  className="text-gray-700 block w-full text-left px-4 py-2 text-sm"
                  onClick={() => {
                    setEditOption(index);
                    setEditedTitle(para.paragraph_title);
                    setEditedContent(para.paragraph_content);
                    setShowOption(null);
                  }}
                >
                  Edit
                </button>
                <button 
                  className="text-gray-700 block w-full text-left px-4 py-2 text-sm"
                  onClick={() => handleDeleteParagraph(para.paragraph_title)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
  
        {editOption === index ? (
          <div className='space-y-4'>
            <input
              autoFocus
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="border p-2 rounded w-full h-32"
            />
            <div className='flex gap-2'>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => handleUpdateParagraph(para.paragraph_title)}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setEditOption(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className='text-lg font-semibold'>{para.paragraph_title}</h3>
            <p className='text-gray-700'>{para.paragraph_content}</p>
          </>
        )}
      </div>
    );
  });

const EditCropPara = () => {
    const { name } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [languageCode, setLanguageCode] = useState('en');
    const [paragraphs, setParagraphs] = useState([]);
    const [showOption, setShowOption] = useState(null);
    const [editOption, setEditOption] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [error, setError] = useState('');
    const [isAddingParagraph, setIsAddingParagraph] = useState(false);
    const [newParaTitle, setNewParaTitle] = useState('');
    const [newParaContent, setNewParaContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchCropData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post(`http://localhost:4000/api/v1/crop/get`, {
                name,
                language_code: languageCode
            });
            const crop = response.data.crop;
            setImageUrl(crop.image_url);
            setParagraphs(crop.paragraphs);
        } catch (err) {
            console.error('Error fetching crop data:', err);
            setError('Failed to fetch crop data');
        } finally {
            setIsLoading(false);
        }
    }, [name, languageCode]);

    useEffect(() => {
        fetchCropData();
    }, [fetchCropData]);

    const handleUpdateParagraph = async (originalTitle) => {
        setIsLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:4000/api/v1/crop/update_para', {
                crop_name: name,
                paragraph_title: originalTitle,
                language_code: languageCode,
                new_title: editedTitle,
                new_text: editedContent
            });
            await fetchCropData();
            setEditOption(null);
        } catch (err) {
            console.error('Error updating paragraph:', err);
            setError('Failed to update paragraph');
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteParagraph = async (paragraphTitle) => {
        if (window.confirm('Are you sure you want to delete this paragraph?')) {
            setIsLoading(true);
            setError('');
            try {
                await axios.post('http://localhost:4000/api/v1/crop/delete_para', {
                    crop_name: name,
                    paragraph_title: paragraphTitle,
                    language_code: languageCode
                });
                await fetchCropData();
            } catch (err) {
                console.error('Error deleting paragraph:', err);
                setError('Failed to delete paragraph');
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleAddParagraph = async () => {
        if (!newParaTitle || !newParaContent) {
            setError('Title and content are required');
            return;
        }
        
        setIsLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:4000/api/v1/crop/add_para', {
                crop_name: name,
                language_code: languageCode,
                para_name: newParaTitle,
                content: newParaContent
            });
            await fetchCropData();
            setIsAddingParagraph(false);
            setNewParaTitle('');
            setNewParaContent('');
        } catch (err) {
            console.error('Error adding paragraph:', err);
            setError('Failed to add paragraph');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='container mx-auto p-4 max-w-4xl'>
            <h1 className='text-2xl font-bold mb-6'>Edit Crop Paragraph</h1>
            
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            {isLoading && <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">Loading...</div>}

            <div className='mb-4'>
                <label htmlFor="language-select" className='block mb-2 font-medium'>Select Language: </label>
                <select 
                    id="language-select"
                    value={languageCode}
                    onChange={(e) => setLanguageCode(e.target.value)}
                    className="border p-2 rounded w-full"
                    disabled={isLoading}
                >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                </select>
            </div>

            {imageUrl && (
                <img 
                    src={imageUrl} 
                    alt={name} 
                    className="w-full max-w-xs mb-6 rounded-lg shadow-md"
                />
            )}
            
            <div className="flex justify-between items-center mb-4">
                <h2 className='text-xl font-bold'>{name}</h2>
                <button 
                    onClick={() => setIsAddingParagraph(true)} 
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded"
                    disabled={isLoading}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Paragraph
                </button>
            </div>

            {isAddingParagraph && (
                <div className='mb-6 border p-4 bg-gray-50'>
                    <h3 className='text-lg font-semibold mb-2'>Add New Paragraph</h3>
                    <div className='space-y-4'>
                        <div>
                            <label htmlFor="new-title" className="block mb-1">Title</label>
                            <input
                                id="new-title"
                                value={newParaTitle}
                                onChange={(e) => setNewParaTitle(e.target.value)}
                                className="border p-2 rounded w-full"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label htmlFor="new-content" className="block mb-1">Content</label>
                            <textarea
                                id="new-content"
                                value={newParaContent}
                                onChange={(e) => setNewParaContent(e.target.value)}
                                className="border p-2 rounded w-full h-32"
                            />
                        </div>
                        <div className='flex gap-2'>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={handleAddParagraph}
                                disabled={isLoading}
                            >
                                Save
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                                onClick={() => {
                                    setIsAddingParagraph(false);
                                    setNewParaTitle('');
                                    setNewParaContent('');
                                }}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='space-y-4'>
                {paragraphs.map((para, index) => (
                    <Paragraph
                        key={`${para.paragraph_title}-${languageCode}`}
                        para={para}
                        index={index}
                        showOption={showOption}
                        editOption={editOption}
                        editedTitle={editedTitle}
                        editedContent={editedContent}
                        setShowOption={setShowOption}
                        setEditOption={setEditOption}
                        setEditedTitle={setEditedTitle}
                        setEditedContent={setEditedContent}
                        handleUpdateParagraph={handleUpdateParagraph}
                        handleDeleteParagraph={handleDeleteParagraph}
                    />
                ))}
            </div>
        </div>
    );
};

export default EditCropPara;