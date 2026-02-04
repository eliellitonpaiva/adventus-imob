import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  disabled = false,
  type = "button",
  fullWidth = false,
  loading = false,
}) => {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center";

  const variants = {
    primary: "bg-[#D4A24D] text-white hover:bg-[#c1923e] focus:ring-[#D4A24D]",
    secondary:
      "bg-[#31353E] text-white hover:bg-[#25282f] focus:ring-[#31353E]",
    outline:
      "border border-[#D4A24D] text-[#D4A24D] hover:bg-[#D4A24D] hover:text-white focus:ring-[#D4A24D]",
    ghost: "text-[#31353E] hover:bg-gray-100 focus:ring-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${widthClass}
        ${className}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {loading ? (
        <>
          <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></span>
          Processando...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
