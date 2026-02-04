import React, { useState } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

const Header = ({
  userName = "Adventus Imobiliária",
  userRole = "Administrador",
  onToggleTheme,
  isDarkMode = false,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar imóveis, corretores, leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-gray-600 hover:text-[#D4A24D] transition-colors rounded-lg hover:bg-gray-100"
            title={isDarkMode ? "Modo claro" : "Modo escuro"}
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-[#D4A24D] transition-colors rounded-lg hover:bg-gray-100"
            >
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-[#D4A24D]/10 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-8 h-8 text-[#D4A24D]" />
              </div>
              <div className="text-left hidden md:block">
                <p className="font-medium text-gray-900">{userName}</p>
                <p className="text-sm text-gray-500">{userRole}</p>
              </div>
              <ChevronDownIcon className="w-5 h-5 text-gray-400 hidden md:block" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
