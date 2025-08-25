// Sidebar.jsx
import React from "react";
import {
  Home,
  BookOpen,
  MessageCircle,
  BarChart3,
  Calendar,
  Settings,
  GraduationCap,
} from "lucide-react";

const Sidebar = ({ navigate }) => {
  return (
    <div className="w-64 min-h-screen bg-white shadow-sm border-r border-gray-200 relative">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">Academy</span>
        </div>
      </div>

      <nav className="px-4 space-y-2">
        <div className="bg-blue-600 text-white rounded-lg px-4 py-3 flex items-center space-x-3">
          <Home size={20} />
          <span className="font-medium">Dashboard</span>
        </div>
        <div
          onClick={() => navigate("/groups")}
          className="text-gray-600 hover:bg-gray-50 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer"
        >
          <BookOpen size={20} />
          <span>Groups</span>
        </div>
        <div className="text-gray-600 hover:bg-gray-50 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer">
          <MessageCircle size={20} />
          <span>Chat</span>
        </div>
        <div className="text-gray-600 hover:bg-gray-50 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer">
          <BarChart3 size={20} />
          <span>Grades</span>
        </div>
        <div
  onClick={() => navigate("/schedule")}
  className="text-gray-600 hover:bg-gray-50 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer"
>
  <Calendar size={20} />
  <span>Schedule</span>

        </div>
        <div className="text-gray-600 hover:bg-gray-50 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer">
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </nav>

      {/* Get Premium Section */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <GraduationCap size={16} className="text-purple-600" />
              </div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-800 text-center mb-1">
            Get Premium
          </h3>
          <p className="text-sm text-gray-600 text-center mb-4">
            Buy premium and get access to new courses
          </p>
          <button className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;