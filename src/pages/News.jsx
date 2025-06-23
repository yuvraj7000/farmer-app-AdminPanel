import { useState, useEffect } from "react";
import { indianLanguages } from "../utils/languages";
import DraggableImagePicker from "../components/DraggableImagePicker";

const News = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    count: 0
  });
  const [selectedNews, setSelectedNews] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [updatedNewsData, setUpdatedNewsData] = useState({
    id: null,
    title: "",
    content: "",
    source: "",
    language_code: "",
    image_url: "",
    youtube_url: ""
  });
  const [newNewsData, setNewNewsData] = useState({
    title: "",
    content: "",
    source: "",
    language_code: selectedLanguage,
    image_url: "",
    youtube_url: ""
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);

  const fetchNews = async (langCode) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/news/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          language_code: langCode,
          page: pagination.page,
          limit: pagination.limit
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      
      const data = await response.json();
      setNewsData(data.news);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        count: data.count
      });
    } catch (err) {
      setError(err.message);
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    // Update the language_code in new news form when selected language changes
    setNewNewsData(prev => ({
      ...prev,
      language_code: selectedLanguage
    }));
  }, [selectedLanguage]);

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handle menu toggle
  const toggleMenu = (e, newsId) => {
    e.stopPropagation(); // Prevent event bubbling
    setMenuOpen(menuOpen === newsId ? null : newsId);
  };

  // Open news details in modal
  const handleOpenNews = (e, news) => {
    e.stopPropagation(); // Prevent event bubbling
    setSelectedNews(news);
    setIsViewModalOpen(true);
    setMenuOpen(null);
  };

  // Open add news modal
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    // Reset the form data with current selected language
    setNewNewsData({
      title: "",
      content: "",
      source: "",
      language_code: selectedLanguage,
      image_url: "",
      youtube_url: ""
    });
  };

  // Open update modal
  const handleOpenUpdateModal = (e, news) => {
    e.stopPropagation(); // Prevent event bubbling
    setSelectedNews(news);
    setUpdatedNewsData({
      id: news.id,
      title: news.title,
      content: news.content,
      source: news.source || "",
      language_code: news.language_code,
      image_url: news.image_url || "",
      youtube_url: news.youtube_url || ""
    });
    setIsUpdateModalOpen(true);
    setMenuOpen(null);
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (e, news) => {
    e.stopPropagation(); // Prevent event bubbling
    setSelectedNews(news);
    setIsDeleteModalOpen(true);
    setMenuOpen(null);
  };

  // Add new news item
  const handleAddNews = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/news/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newNewsData)
      });

      if (!response.ok) {
        throw new Error("Failed to add news");
      }

      const data = await response.json();
      
      // Add new news to local state if it matches the current language filter
      if (data.news.language_code === selectedLanguage) {
        setNewsData([data.news, ...newsData]);
      }
      
      setIsAddModalOpen(false);
      // Show success message
      alert("News added successfully!");
    } catch (err) {
      console.error("Error adding news:", err);
      alert(`Error adding news: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Update news item
  const handleUpdateNews = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/news/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedNewsData)
      });

      if (!response.ok) {
        throw new Error("Failed to update news");
      }

      const data = await response.json();
      
      // Update local state with updated news
      setNewsData(newsData.map(item => 
        item.id === data.news.id ? data.news : item
      ));
      
      setIsUpdateModalOpen(false);
      setSelectedNews(null);
    } catch (err) {
      console.error("Error updating news:", err);
      alert(`Error updating news: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete news item
  const handleDeleteNews = async () => {
    if (!selectedNews) return;
    
    setActionLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/api/v1/news/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: selectedNews.id })
      });

      if (!response.ok) {
        throw new Error("Failed to delete news");
      }

      await response.json();
      
      // Remove deleted news from local state
      setNewsData(newsData.filter(item => item.id !== selectedNews.id));
      
      setIsDeleteModalOpen(false);
      setSelectedNews(null);
    } catch (err) {
      console.error("Error deleting news:", err);
      alert(`Error deleting news: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    e.stopPropagation();
    setMenuOpen(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">News & Updates</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add News
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Select Language</h2>
        
        <div className="flex flex-wrap gap-2">
          {indianLanguages.map((language) => (
            <button 
              key={language.code}
              className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium
                ${selectedLanguage === language.code 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              {language.name}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div>
          {newsData.length === 0 ? (
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 text-center">
              <p className="text-gray-600">No news available in {indianLanguages.find(lang => lang.code === selectedLanguage)?.name || "English"}.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsData.map((news) => (
                  <div key={news.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full relative">
                    {/* Three-dot menu */}
                    <div className="absolute top-2 right-2 z-20">
                      <button 
                        onClick={(e) => toggleMenu(e, news.id)}
                        className="p-1.5 bg-white bg-opacity-80 rounded-full shadow-sm hover:bg-opacity-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      
                      {/* Dropdown menu */}
                      {menuOpen === news.id && (
                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-30 border border-gray-200">
                          <div className="py-1">
                            <button 
                              onClick={(e) => handleOpenNews(e, news)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Open
                            </button>
                            <button 
                              onClick={(e) => handleOpenUpdateModal(e, news)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Update
                            </button>
                            <button 
                              onClick={(e) => handleOpenDeleteModal(e, news)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {news.image_url ? (
                      <div className="h-48 w-full overflow-hidden">
                        <img 
                          src={news.image_url} 
                          alt={news.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="p-4 flex-grow flex flex-col">
                      <div className="mb-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">{news.title}</h3>
                        </div>
                        <span className="text-xs text-gray-500 block">{formatDate(news.date)}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 flex-grow">{news.content.substring(0, 150)}...</p>
                      
                      <div className="flex justify-between items-center text-xs mt-auto">
                        <span className="text-gray-500">Source: {news.source || "Unknown"}</span>
                        {news.youtube_url && (
                          <a 
                            href={news.youtube_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-700 flex items-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                            </svg>
                            Watch
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-8 mb-4">
                <div className="text-sm text-gray-600">
                  Showing {pagination.count} of {pagination.total} news items
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Add News Modal */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-800 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-4 border-b">
              <h2 className="text-xl font-semibold">Add New News</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newNewsData.title}
                    onChange={(e) => setNewNewsData({...newNewsData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter news title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    rows="6"
                    value={newNewsData.content}
                    onChange={(e) => setNewNewsData({...newNewsData, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter news content"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <input
                    type="text"
                    value={newNewsData.source}
                    onChange={(e) => setNewNewsData({...newNewsData, source: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter source name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={newNewsData.language_code}
                    onChange={(e) => setNewNewsData({...newNewsData, language_code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {indianLanguages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={newNewsData.image_url}
                    onChange={(e) => setNewNewsData({...newNewsData, image_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter image URL"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                  <input
                    type="text"
                    value={newNewsData.youtube_url}
                    onChange={(e) => setNewNewsData({...newNewsData, youtube_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter YouTube URL"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNews}
                  disabled={actionLoading || !newNewsData.title || !newNewsData.content}
                  className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center ${(!newNewsData.title || !newNewsData.content) && 'opacity-50 cursor-not-allowed'}`}
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Adding...
                    </>
                  ) : "Add News"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View News Modal */}
      {isViewModalOpen && selectedNews && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-800 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-4 border-b">
              <h2 className="text-xl font-semibold">{selectedNews.title}</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <span className="text-sm text-gray-500">{formatDate(selectedNews.date)} • {selectedNews.source || "Unknown"}</span>
              </div>
              
              {selectedNews.image_url && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={selectedNews.image_url} 
                    alt={selectedNews.title} 
                    className="w-full h-auto"
                  />
                </div>
              )}
              
              <div className="prose max-w-none">
                <p>{selectedNews.content}</p>
              </div>
              
              {selectedNews.youtube_url && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Video</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe 
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedNews.youtube_url)}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-64"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update News Modal */}
      {isUpdateModalOpen && selectedNews && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4"
          onClick={() => setIsUpdateModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-800 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-4 border-b">
              <h2 className="text-xl font-semibold">Update News</h2>
              <button 
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={updatedNewsData.title}
                    onChange={(e) => setUpdatedNewsData({...updatedNewsData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    rows="6"
                    value={updatedNewsData.content}
                    onChange={(e) => setUpdatedNewsData({...updatedNewsData, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <input
                    type="text"
                    value={updatedNewsData.source}
                    onChange={(e) => setUpdatedNewsData({...updatedNewsData, source: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={updatedNewsData.language_code}
                    onChange={(e) => setUpdatedNewsData({...updatedNewsData, language_code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {indianLanguages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={updatedNewsData.image_url}
                    onChange={(e) => setUpdatedNewsData({...updatedNewsData, image_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                  <input
                    type="text"
                    value={updatedNewsData.youtube_url}
                    onChange={(e) => setUpdatedNewsData({...updatedNewsData, youtube_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateNews}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Updating...
                    </>
                  ) : "Update News"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedNews && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full border-2 border-gray-800 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-center mb-2">Delete News</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete this news item? This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteNews}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Deleting...
                    </>
                  ) : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop click handler to close menus */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={handleBackdropClick}
        ></div>
      )}

      <DraggableImagePicker/>

    </div>
  );
};

export default News;