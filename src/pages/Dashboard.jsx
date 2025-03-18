import { useEffect, useState } from "react";
import NavigationButton from "../components/NavigationButton";
import axios from "axios";

const Dashboard = () => {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      const res = await axios.get("http://localhost:5000/api/schemes");
      setSchemes(res.data);
    };
    fetchSchemes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-wrap">
        <NavigationButton buttonName="Schemes" navigation="/schemes"/>
            </div>
    </div>
  );
};

export default Dashboard;
