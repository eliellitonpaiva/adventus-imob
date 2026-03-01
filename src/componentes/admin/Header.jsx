import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ IMPORTANTE
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Header = ({
  userName = "Adventus Imobiliária",
  userRole = "Administrador",
  onToggleTheme,
  isDarkMode = false,
  onLogout, // ✅ RECEBE A FUNÇÃO DE LOGOUT
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // ✅ PARA NAVEGAÇÃO

  return (
    <header
      className={`
      border-b px-6 py-4 shadow-sm transition-colors duration-200
      ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
    `}
    >
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <MagnifyingGlassIcon
              className={`
              absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
              ${isDarkMode ? "text-gray-400" : "text-gray-500"}
            `}
            />
            <input
              type="text"
              placeholder="Buscar imóveis, corretores, leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-[#D4A24D]/30 transition-colors duration-200
                ${
                  isDarkMode
                    ? "bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[#D4A24D]"
                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D]"
                }
              `}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${
                isDarkMode
                  ? "text-gray-300 hover:text-[#D4A24D] bg-gray-700 hover:bg-gray-600"
                  : "text-gray-600 hover:text-[#D4A24D] bg-gray-100 hover:bg-gray-200"
              }
            `}
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
              className={`
                relative p-2 rounded-lg transition-all duration-200
                ${
                  isDarkMode
                    ? "text-gray-300 hover:text-[#D4A24D] bg-gray-700 hover:bg-gray-600"
                    : "text-gray-600 hover:text-[#D4A24D] bg-gray-100 hover:bg-gray-200"
                }
              `}
            >
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* User Profile com DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className={`
                flex items-center space-x-3 p-2 rounded-lg transition-all duration-200
                ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }
              `}
            >
              <div
                className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${isDarkMode ? "bg-gray-600" : "bg-[#D4A24D]/10"}
              `}
              >
                <UserCircleIcon
                  className={`
                  w-8 h-8
                  ${isDarkMode ? "text-gray-400" : "text-[#D4A24D]"}
                `}
                />
              </div>
              <div className="text-left hidden md:block">
                <p className="font-medium">{userName}</p>
                <p
                  className={`
                  text-sm
                  ${isDarkMode ? "text-gray-400" : "text-gray-600"}
                `}
                >
                  {userRole}
                </p>
              </div>
              <ChevronDownIcon
                className={`
                w-5 h-5 hidden md:block transition-transform duration-200
                ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                ${showProfile ? "rotate-180" : ""}
              `}
              />
            </button>

            {/* DROPDOWN MENU */}
            {showProfile && (
              <>
                {/* Overlay para fechar ao clicar fora */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfile(false)}
                />

                {/* Menu dropdown */}
                <div
                  className={`
                    absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-20
                    ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    }
                  `}
                >
                  {/* Cabeçalho do dropdown (visível só em mobile) */}
                  <div className="md:hidden px-4 py-3 border-b dark:border-gray-700">
                    <p className="font-medium">{userName}</p>
                    <p
                      className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {userRole}
                    </p>
                  </div>

                  {/* Meu Perfil */}
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      navigate("/admin/perfil");
                    }}
                    className={`
                      w-full flex items-center px-4 py-3 text-sm
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      transition-colors duration-200
                      ${isDarkMode ? "text-gray-200" : "text-gray-700"}
                    `}
                  >
                    <UserIcon className="w-5 h-5 mr-3" />
                    Meu Perfil
                  </button>

                  {/* Sair */}
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      if (onLogout) onLogout();
                    }}
                    className={`
                      w-full flex items-center px-4 py-3 text-sm
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      transition-colors duration-200
                      border-t dark:border-gray-700
                      ${isDarkMode ? "text-red-400" : "text-red-600"}
                    `}
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
