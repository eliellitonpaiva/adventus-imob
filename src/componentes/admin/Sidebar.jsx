import React, { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

// Componente MenuItem embutido para evitar problemas de importação
const MenuItem = ({
  icon: Icon,
  label,
  to,
  badge,
  isCollapsed,
  isActive = false,
}) => {
  const { isDark } = useTheme();

  return (
    <NavLink
      to={to}
      className={({ isActive: navIsActive }) => `
        flex items-center 
        ${isCollapsed ? "justify-center px-0" : "px-4"} 
        py-2.5 rounded-lg transition-all duration-200
        ${
          navIsActive || isActive
            ? "bg-[#D4A24D]/20 text-[#D4A24D] border-l-4 border-[#D4A24D]"
            : `${
                isDark
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`
        }
        relative
        text-sm font-semibold
        min-h-[40px]
      `}
      end={to === "/admin"}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Icon className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"}`} />

      {!isCollapsed && (
        <>
          <span className="flex-grow">{label}</span>
          {badge !== undefined && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </>
      )}

      {isCollapsed && badge !== undefined && (
        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </NavLink>
  );
};

// Componente principal Sidebar
const Sidebar = ({ onLogout, userName = "Adventus Imobiliária" }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    console.log(
      "Rota alterada para:",
      location.pathname,
      "Sidebar collapsed:",
      collapsed,
    );
  }, [location.pathname, collapsed]);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const HomeIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );

  const BuildingOfficeIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );

  const UserGroupIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );

  const EnvelopeIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );

  const CalendarIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );

  const ChartBarIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );

  const Cog6ToothIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  const ArrowRightOnRectangleIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );

  const ChevronLeftIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );

  const ChevronRightIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5l7 7-7 7"
      />
    </svg>
  );

  const DocumentTextIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  const MapIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  );

  const LocationMarkerIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  const HomeModernIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-4.5 1.636m0 0l-1.125.33m1.125-.33l1.125.33m0 0l1.125.33m-2.25 0l1.125.33m0 0l1.125.33M7.5 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75"
      />
    </svg>
  );

  const menuItems = [
    { icon: HomeIcon, label: "Dashboard", to: "/admin", exact: true },
    {
      icon: BuildingOfficeIcon,
      label: "Imóveis",
      to: "/admin/imoveis",
      badge: 12,
    },
    {
      icon: UserGroupIcon,
      label: "Corretores",
      to: "/admin/corretores",
      badge: 8,
    },
    { icon: EnvelopeIcon, label: "Leads", to: "/admin/leads", badge: 23 },
    {
      icon: CalendarIcon,
      label: "Visitas",
      to: "/admin/visitas",
      badge: 5,
    },
    { icon: MapIcon, label: "Estados", to: "/admin/estados" },
    { icon: LocationMarkerIcon, label: "Cidades", to: "/admin/cidades" },
    { icon: HomeModernIcon, label: "Bairros", to: "/admin/bairros" },
    { icon: ChartBarIcon, label: "Relatórios", to: "/admin/relatorios" },
    {
      icon: DocumentTextIcon,
      label: "Contratos",
      to: "/admin/contratos",
      badge: 5,
    },
    { icon: Cog6ToothIcon, label: "Configurações", to: "/admin/configuracoes" },
  ];

  const isItemActive = (item) => {
    if (item.exact) {
      return location.pathname === item.to;
    }
    return location.pathname.startsWith(item.to);
  };

  return (
    <aside
      className={`
        ${isDark ? "bg-gray-800 text-gray-200" : "bg-[#31353E] text-white"}
        flex flex-col h-screen
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-64"}
        sticky top-0
        shadow-lg
        transition-colors duration-200
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`p-4 border-b ${isDark ? "border-gray-700" : "border-gray-700"} flex items-center ${collapsed ? "justify-center" : "justify-between"}`}
      >
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#D4A24D] rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Adventus Imobiliária</h1>
              <p
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-400"} mt-0.5`}
              >
                {userName}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-[#D4A24D] rounded-lg flex items-center justify-center">
            <BuildingOfficeIcon className="w-5 h-5 text-white" />
          </div>
        )}

        {!collapsed && (
          <button
            onClick={handleToggleCollapse}
            className={`
              ${
                isDark
                  ? "text-gray-300 hover:text-[#D4A24D] hover:bg-gray-700"
                  : "text-gray-300 hover:text-[#D4A24D] hover:bg-white/10"
              }
              transition-all duration-200
              border border-[#D4A24D]/50
              ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white/5 hover:bg-white/10"
              }
              rounded-lg p-1.5
            `}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            <ChevronLeftIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center mt-4 px-3">
          <button
            onClick={handleToggleCollapse}
            className={`
              ${
                isDark
                  ? "text-gray-300 hover:text-[#D4A24D] hover:bg-gray-700"
                  : "text-gray-300 hover:text-[#D4A24D] hover:bg-white/10"
              }
              transition-all duration-200
              border border-[#D4A24D]/50
              ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white/5 hover:bg-white/10"
              }
              rounded-lg p-1.5
              w-7 h-7 flex items-center justify-center
            `}
            title="Expandir menu"
          >
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <nav
        className="flex-1 p-3 space-y-0.5 overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: `${isDark ? "rgba(75, 85, 99, 0.3)" : "rgba(156, 163, 175, 0.3)"} transparent`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>
          {`
            nav::-webkit-scrollbar {
              width: 6px;
            }
            
            nav::-webkit-scrollbar-track {
              background: transparent;
              border-radius: 10px;
            }
            
            nav::-webkit-scrollbar-thumb {
              background: ${
                isDark ? "rgba(75, 85, 99, 0.3)" : "rgba(156, 163, 175, 0.3)"
              };
              border-radius: 10px;
              opacity: 0;
              transition: opacity 0.3s ease, background 0.3s ease;
            }
            
            nav:hover::-webkit-scrollbar-thumb {
              background: ${
                isDark ? "rgba(75, 85, 99, 0.5)" : "rgba(156, 163, 175, 0.5)"
              };
              opacity: 1;
            }
            
            nav::-webkit-scrollbar-thumb:hover {
              background: ${
                isDark ? "rgba(75, 85, 99, 0.7)" : "rgba(156, 163, 175, 0.7)"
              };
            }
            
            nav {
              scrollbar-width: thin;
              scrollbar-color: ${
                isDark ? "rgba(75, 85, 99, 0.3)" : "rgba(156, 163, 175, 0.3)"
              } transparent;
            }
          `}
        </style>

        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            to={item.to}
            badge={item.badge}
            isCollapsed={collapsed}
            isActive={isItemActive(item)}
          />
        ))}
      </nav>

      <div
        className={`p-3 border-t ${isDark ? "border-gray-700" : "border-gray-700"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLogout();
          }}
          className={`
            w-full flex items-center 
            ${collapsed ? "justify-center" : "space-x-2 px-3"} 
            py-2 rounded-lg transition-all duration-200 
            bg-[#D4A24D] text-white
            hover:bg-[#e6b64e] hover:shadow-md
            text-sm
          `}
          title={collapsed ? "Sair" : ""}
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          {!collapsed && (
            <span className="font-medium flex-grow text-left">Sair</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
