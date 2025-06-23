import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!name || !password) {
      setError("Please enter both name and password");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const storedEncryptedName = import.meta.env.VITE_NAME;
      const storedEncryptedPassword = import.meta.env.VITE_PASSWORD;
      console.log("Stored Encrypted Name:", storedEncryptedName);
      console.log("Stored Encrypted Password:", storedEncryptedPassword);
      console.log("Input Name:", name);
      console.log("Input Password:", password);
      
      if (storedEncryptedName && storedEncryptedPassword) {
        try {
         
          if (name === storedEncryptedName && password === storedEncryptedPassword) {
            console.log("Login successful with stored credentials");
            sessionStorage.setItem("auth", name);
            navigate("/dashboard");
            return;
          }
        } catch (Error) {
          console.error("Decryption error:", Error);
          // Continue to authentication failure
        }
      }
      
      // If we've made it here, authentication failed
      console.log("Login failed - invalid credentials");
      setError("Invalid username or password");
      
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          {/* <h1 className="text-2xl font-bold text-green-600">Kisan Bandhu</h1> */}
          <h2 className="text-xl font-bold text-gray-800 mt-1">Admin Panel</h2>
        </div>
        
        {error && (
          <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter username"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
       
      </div>
    </div>
  );
};

export default LoginPage;