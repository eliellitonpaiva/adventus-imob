import React, { useState } from "react";
import {
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  EnvelopeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import MenuItem from "./MenuItem";

const Sidebar = ({ onLogout, userName = "Adventus Imobiliária" }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: HomeIcon, label: "Dashboard", to: "/admin" },
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
    { icon: ChartBarIcon, label: "Relatórios", to: "/admin/relatorios" },
    {
      icon: DocumentTextIcon,
      label: "Contratos",
      to: "/admin/contratos",
      badge: 5,
    },
    { icon: Cog6ToothIcon, label: "Configurações", to: "/admin/configuracoes" },
  ];

  return (
    <aside
      className={`
      bg-[#31353E] text-white
      flex flex-col h-screen
      transition-all duration-300 ease-in-out
      ${collapsed ? "w-20" : "w-64"}
      sticky top-0
      shadow-lg
    `}
    >
      {/* Logo */}
      <div
        className={`p-6 border-b border-gray-700 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}
      >
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#D4A24D] rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Adventus Imobiliária</h1>
              <p className="text-xs text-gray-400 mt-0.5">{userName}</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-[#D4A24D] rounded-lg flex items-center justify-center">
            <BuildingOfficeIcon className="w-5 h-5 text-white" />
          </div>
        )}

        {/* BOTÃO RECOLHER/EXPANDIR - AJUSTADO */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            text-gray-300 hover:text-[#D4A24D] hover:bg-white/10 
            transition-all duration-200
            ${
              collapsed
                ? "absolute -right-3 top-20 bg-[#31353E] rounded-full p-2 border border-[#D4A24D]/30"
                : "ml-auto bg-white/5 hover:bg-white/10 rounded-lg p-2"
            }
          `}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <ChevronRightIcon className="w-4 h-4" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            to={item.to}
            badge={item.badge}
            isCollapsed={collapsed}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className={`w-full flex items-center ${collapsed ? "justify-center" : "space-x-3 px-4"} py-3.5 rounded-lg transition-all duration-200 text-gray-300 hover:bg-white/5 hover:text-white`}
          title={collapsed ? "Sair" : ""}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          {!collapsed && (
            <span className="font-medium flex-grow text-left">Sair</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
