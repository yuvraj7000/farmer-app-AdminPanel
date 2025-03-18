import { Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/addSchemes" element={<AddSchemes />} />
        <Route path="/edit-scheme/:id" element={<EditScheme />} />
        <Route path="/edit-translation/:schemeId" element={<EditTranslation />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/addCrop" element={<AddCrop />} />
        <Route path="/UpdateCrop" element={<UpdateCrop />} />
        <Route path="/editCropPara/:name" element={<EditCropPara />} />
      </Route>
    </Routes>
  );
};

export default App;
