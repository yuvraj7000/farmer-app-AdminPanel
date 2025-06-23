import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Check if user is authenticated using your current logic
  const token = sessionStorage.getItem("auth");
  const isAuthenticated = token === import.meta.env.VITE_NAME;
  
  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and children are provided, render children
  // Otherwise render the Outlet for nested routes
  return children || <Outlet />;
};

export default PrivateRoute;