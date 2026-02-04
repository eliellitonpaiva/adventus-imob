import React from "react";

const Input = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = "",
  className = "",
  required = false,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2.5 border rounded-lg
          focus:outline-none focus:ring-2 focus:border-transparent
          transition-all duration-200
          ${
            error
              ? "border-red-300 focus:ring-red-200"
              : "border-gray-300 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]"
          }
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          ${className}
        `}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
