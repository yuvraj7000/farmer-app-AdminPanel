import { Routes, Route, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Schemes from "./pages/Schemes.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AddSchemes from "./pages/addSchemes.jsx";
import EditScheme from "./pages/EditScheme.jsx";
import EditTranslation from "./pages/EditTranslation.jsx";
import Crops from "./pages/Crops.jsx";
import AddCrop from "./pages/AddCrop.jsx";
import UpdateCrop from "./pages/UpdateCrop.jsx";
import EditCropPara from "./pages/EditCropPara.jsx";
import News from "./pages/News.jsx";
import Notifications from "./pages/Notifications.jsx";
import Navbar from "./components/Navbar.jsx";

// Layout component that includes the Navbar
const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <Outlet /> {/* This renders the matched child route */}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      {/* Wrap routes that need Navbar with the DashboardLayout */}
      <Route 
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        {/* Child routes will be rendered where the Outlet is */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/addSchemes" element={<AddSchemes />} />
        <Route path="/edit-scheme/:id" element={<EditScheme />} />
        <Route path="/edit-translation/:schemeId" element={<EditTranslation />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/addCrop" element={<AddCrop />} />
        <Route path="/UpdateCrop" element={<UpdateCrop />} />
        <Route path="/editCropPara/:name" element={<EditCropPara />} />
        <Route path="/news" element={<News />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default App;