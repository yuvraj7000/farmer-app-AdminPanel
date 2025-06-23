import { useState, useEffect } from "react";
import axios from "axios";
import { Bell, Send, Info, X, CheckCircle, AlertTriangle, Calendar, Clock, Globe } from "lucide-react";
import { indianLanguages } from "../utils/languages";

export default function Notifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [history, setHistory] = useState([]);
  const [showDetails, setShowDetails] = useState(null);

  useEffect(() => {
    // Fetch notification history from local storage on component mount
    const savedHistory = localStorage.getItem("notificationHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (notification) => {
    const updatedHistory = [
      {
        id: Date.now(),
        date: new Date().toISOString(),
        ...notification
      },
      ...history
    ];
    setHistory(updatedHistory);
    localStorage.setItem("notificationHistory", JSON.stringify(updatedHistory));
  };

  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      setNotification({
        type: "error",
        message: "Title and message are required!"
      });
      return;
    }

    setLoading(true);
    setNotification(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/v1/pushNotification/sendall`,
        {
          title,
          message,
          language
        }
      );

      const result = response.data;
      const successCount = result.responses[0].successCount;
      const failureCount = result.responses[0].failureCount;
      const totalCount = successCount + failureCount;

      setNotification({
        type: "success",
        message: `Notification sent successfully to ${successCount} of ${totalCount} devices.`,
        data: result
      });

      // Save to history
      saveToHistory({
        title,
        message,
        language,
        successCount,
        failureCount,
        totalCount
      });

      // Reset form
      setTitle("");
      setMessage("");
    } catch (error) {
      console.error("Error sending notification:", error);
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Failed to send notification."
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const toggleDetails = (id) => {
    setShowDetails(showDetails === id ? null : id);
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all notification history?")) {
      setHistory([]);
      localStorage.removeItem("notificationHistory");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <Bell className="w-8 h-8 text-blue-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Push Notifications</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Send New Notification</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {indianLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification title"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength="100"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {title.length}/100 characters
                </p>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter notification message"
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength="200"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {message.length}/200 characters
                </p>
              </div>
              
              {notification && (
                <div className={`p-4 rounded-md ${
                  notification.type === 'error' 
                    ? 'bg-red-50 text-red-800 border border-red-200' 
                    : 'bg-green-50 text-green-800 border border-green-200'
                }`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {notification.type === 'error' ? (
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        {notification.message}
                      </p>
                      {notification.type === 'success' && notification.data && (
                        <div className="mt-2 text-xs">
                          <p>Success: {notification.data.responses[0].successCount}</p>
                          <p>Failed: {notification.data.responses[0].failureCount}</p>
                        </div>
                      )}
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">
                        <button
                          onClick={() => setNotification(null)}
                          className={`inline-flex rounded-md p-1.5 ${
                            notification.type === 'error' 
                              ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                              : 'bg-green-100 text-green-500 hover:bg-green-200'
                          }`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={sendNotification}
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Notification
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">About Notifications</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Notifications are sent to all users with the selected language preference. Make sure your message is clear and relevant.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Notification History</h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear History
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No notifications have been sent yet.</p>
                <p className="text-sm mt-1">When you send notifications, they will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div 
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleDetails(item.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-md">
                          <Bell className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-1">{item.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-right mr-4">
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(item.date)}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(item.date)}
                          </div>
                        </div>
                        <span className="transform transition-transform duration-200" style={{
                          transform: showDetails === item.id ? 'rotate(180deg)' : 'rotate(0)'
                        }}>
                          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    
                    {showDetails === item.id && (
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-1">Title</h4>
                            <p className="text-sm">{item.title}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-1">Language</h4>
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="text-sm">
                                {indianLanguages.find(lang => lang.code === item.language)?.name || item.language}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-xs font-medium text-gray-500 mb-1">Message</h4>
                          <p className="text-sm p-3 bg-white border border-gray-200 rounded-md">{item.message}</p>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-1">Delivery Results</h4>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                                <span className="text-sm">{item.successCount} successful</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                                <span className="text-sm">{item.failureCount} failed</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-1">Success Rate</h4>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                              <div 
                                className="bg-green-500 h-2.5 rounded-full" 
                                style={{ width: `${(item.successCount / item.totalCount) * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500">
                              {Math.round((item.successCount / item.totalCount) * 100)}% delivered
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}