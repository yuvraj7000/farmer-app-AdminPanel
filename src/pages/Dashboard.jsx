import { useEffect, useState } from "react";
import NavigationButton from "../components/NavigationButton";
import axios from "axios";
import { BarChart3, Users, Sprout, Newspaper, Bell, TrendingUp } from "lucide-react";

const Dashboard = () => {
  

  // Quick stats cards
  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex items-center`}>
      <div className={`rounded-full p-3 mr-4 ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  // Navigation section
  const navItems = [
    { name: "Schemes", path: "/schemes", icon: <BarChart3 size={24} className="mb-2" />, color: "bg-blue-50 text-blue-600" },
    { name: "Crops", path: "/crops", icon: <Sprout size={24} className="mb-2" />, color: "bg-green-50 text-green-600" },
    { name: "News", path: "/news", icon: <Newspaper size={24} className="mb-2" />, color: "bg-purple-50 text-purple-600" },
    { name: "Notifications", path: "/notifications", icon: <Bell size={24} className="mb-2" />, color: "bg-yellow-50 text-yellow-600" }
  ];

  

  return (
    <div className="py-6">
      {/* Dashboard Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to Kisan Bandhu Admin Panel</p>
        </div>
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-md flex items-center">
          <TrendingUp size={18} className="mr-2" />
          <span className="font-medium">System Status: Online</span>
        </div>
      </div>

     

      {/* Quick Navigation Section */}
      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {navItems.map((item) => (
            <NavigationButton 
              key={item.path}
              buttonName={item.name}
              navigation={item.path}
              className={`flex flex-col items-center justify-center p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all ${item.color} h-40`}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;