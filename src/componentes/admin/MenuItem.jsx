import React from "react";
import { Link, useLocation } from "react-router-dom";

const MenuItem = ({
  icon: IconComponent,
  label,
  to,
  badge = null,
  onClick,
  isCollapsed = false,
}) => {
  const location = useLocation();
  const isActive =
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`
          w-full flex items-center ${isCollapsed ? "justify-center" : "space-x-3 px-4"} py-3.5
          rounded-lg transition-all duration-200 relative
          ${
            isActive
              ? "bg-[#D4A24D]/10 text-[#D4A24D] border-l-4 border-[#D4A24D]"
              : "text-gray-300 hover:bg-white/5 hover:text-white"
          }
          ${isCollapsed && isActive ? "pl-3" : ""}
        `}
        title={isCollapsed ? label : ""}
      >
        <IconComponent className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="font-medium flex-grow text-left">{label}</span>
            {badge && (
              <span className="bg-[#D4A24D] text-white text-xs font-semibold px-2 py-1 rounded-full">
                {badge}
              </span>
            )}
          </>
        )}
        {isCollapsed && badge && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4A24D] rounded-full" />
        )}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className={`
        w-full flex items-center ${isCollapsed ? "justify-center" : "space-x-3 px-4"} py-3.5
        rounded-lg transition-all duration-200 relative
        ${
          isActive
            ? "bg-[#D4A24D]/10 text-[#D4A24D] border-l-4 border-[#D4A24D]"
            : "text-gray-300 hover:bg-white/5 hover:text-white"
        }
        ${isCollapsed && isActive ? "pl-3" : ""}
      `}
      title={isCollapsed ? label : ""}
    >
      <IconComponent className="w-5 h-5 flex-shrink-0" />
      {!isCollapsed && (
        <>
          <span className="font-medium flex-grow">{label}</span>
          {badge && (
            <span className="bg-[#D4A24D] text-white text-xs font-semibold px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
      {isCollapsed && badge && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4A24D] rounded-full" />
      )}
    </Link>
  );
};

export default MenuItem;
